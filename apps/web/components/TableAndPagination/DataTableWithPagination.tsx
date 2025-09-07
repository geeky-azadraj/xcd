"use client"

import { useRef, useCallback, ReactNode } from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import NoDataFound from "./NoDataFound"

import React, { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "../Icons"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  className?: string
  headerClassName?: string
  rowClassName?: string | ((row: TData) => string)
  cellClassName?: string
  headerCellClassName?: string
  handleRowClick?: (row: TData) => void
  tableDivClassName?: string
  isLoading?: boolean
  onHoverMessage?: (row: TData) => string | undefined
  selectable?: boolean
  selectedRows?: TData[]
  onSelectedRowsChange?: (rows: TData[]) => void
  by?: string | ((a: TData, z: TData) => boolean)
  renderTopActions?: (selectedRows: TData[]) => ReactNode
  sortByString?: string | null
  sortByOrderString?: string | null
  onSortingChange?: (columnId: string | null) => void
  isRowSelectable?: (row: TData) => boolean

  totalItems: number
  pageNo: number
  itemsPerPage?: 10 | 20 | 50 | 2
  onChange: (currentPage: number, pageSize: number) => void
  PaginationClassName?: string
}

const SortIcons = ({
  isSorted,
  hasData,
  onDirectSort,
}: {
  isSorted: false | "asc" | "desc"
  hasData: boolean
  onDirectSort: () => void
}) => {
  if (!hasData) return null

  return (
    <div
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        onDirectSort()
      }}
    >
      <Icons.IconArrowSort className="ml-2 inline-block" sortState={isSorted || "none"} />
    </div>
  )
}

function DataTableWithPagination<TData>({
  columns,
  data,
  className = "",
  headerClassName = "",
  rowClassName,
  cellClassName = "",
  headerCellClassName = "",
  handleRowClick,
  tableDivClassName = "",
  isLoading = false,
  onHoverMessage,
  selectable = false,
  selectedRows = [],
  onSelectedRowsChange,
  by = (a: TData, z: TData) => a === z,
  renderTopActions,
  sortByString,
  sortByOrderString,
  onSortingChange,
  isRowSelectable = () => true,

  totalItems,
  pageNo,
  itemsPerPage = 10,
  onChange,
  PaginationClassName = "",
}: DataTableProps<TData>) {
  const tableRef = useRef<HTMLDivElement>(null)
  const [activeRowTooltip, setActiveRowTooltip] = useState<{
    message: string
    rowElement: HTMLElement
  } | null>(null)

  const compareRows = useCallback(
    (a: TData, b: TData): boolean => {
      if (!a || !b) return false
      if (typeof by === "string") {
        const key = by as keyof TData
        const aValue = a[key]
        const bValue = b[key]
        return aValue !== undefined && bValue !== undefined && aValue === bValue
      }
      return by(a, b)
    },
    [by]
  )

  const isRowSelected = useCallback(
    (row: TData): boolean => {
      if (!row) return false
      return selectedRows.some((selectedRow) => compareRows(row, selectedRow))
    },
    [selectedRows, compareRows]
  )

  const handleSelectRow = useCallback(
    (row: TData) => {
      if (!row || !isRowSelectable(row)) return
      const isSelected = isRowSelected(row)
      const newSelectedRows = isSelected ? selectedRows.filter((r) => !compareRows(r, row)) : [...selectedRows, row]
      onSelectedRowsChange?.(newSelectedRows)
    },
    [selectedRows, isRowSelected, compareRows, onSelectedRowsChange, isRowSelectable]
  )

  const handleSelectAll = useCallback(() => {
    onSelectedRowsChange?.(
      selectedRows.length === data.filter(isRowSelectable).length ? [] : data.filter(isRowSelectable)
    )
  }, [data, selectedRows.length, onSelectedRowsChange, isRowSelectable])

  const selectableColumns: ColumnDef<TData>[] = selectable
    ? [
        {
          id: "select",
          size: 40,
          header: () => (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={data.length > 0 && selectedRows.length === data.filter(isRowSelectable).length}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
                className="border-secondary-500 data-[state=checked]:bg-primary-650 data-[state=checked]:border-primary-650 mr-2 h-5 w-5 rounded-[4px] 
                border-2 text-white"
              />
            </div>
          ),
          cell: ({ row }: { row: any }) => {
            const rowData = row.original
            const checked = isRowSelected(rowData)
            const canSelect = isRowSelectable(rowData)

            return (
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => handleSelectRow(rowData)}
                  aria-label="Select row"
                  disabled={!canSelect}
                  className={`border-secondary-500 data-[state=checked]:bg-primary-650 data-[state=checked]:border-primary-650 mr-2 h-5 w-5 rounded-[4px] 
                  border-2 text-white
                  ${!canSelect ? "cursor-not-allowed opacity-50" : ""}`}
                />
              </div>
            )
          },
          enableSorting: false,
        },
        ...columns,
      ]
    : columns

  const handleSortChange = (columnId: string | null) => {
    if (!onSortingChange) return

    // Follow the cycle: none -> asc -> desc -> none
    if (!sortByString || sortByString !== columnId) {
      // New column or no current sort, start with asc
      onSortingChange(columnId)
    } else if (sortByOrderString === "asc") {
      // Current column is asc, change to desc
      onSortingChange(columnId)
    } else {
      // Current column is desc, remove sort
      onSortingChange(null)
    }
  }

  const table = useReactTable({
    data,
    columns: selectableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater: any) => {
      const currentSorting = typeof updater === "function" ? updater([]) : updater
      const currentColumnId = currentSorting?.[0]?.id || null
      handleSortChange(currentColumnId)
    },
    state: {
      sorting: sortByString ? [{ id: sortByString, desc: sortByOrderString === "desc" }] : [],
    },
  })

  const renderCell = (header: any, isLoading = false) => {
    const width = header.column.columnDef.size || "auto"
    const style = {
      width: typeof width === "number" ? `${width}px` : width,
      minWidth: typeof width === "number" ? `${width}px` : width,
      ...(isLoading ? {} : { fontFamily: "Nunito Sans", fontWeight: "400", fontSize: "14px", lineHeight: "19px" }),
    }

    if (isLoading) {
      return (
        <TableCell key={header.id} className={`p-2 sm:p-4 border-t ${cellClassName}`} style={style}>
          <Skeleton className="h-6 w-[80%]" />
        </TableCell>
      )
    }

    const value = header.column.columnDef.cell
      ? flexRender(header.column.columnDef.cell, header.getContext())
      : flexRender(header.column.columnDef.accessorFn?.(header.getContext().row.original), header.getContext())

    return (
      <TableCell key={header.id} className={`p-2 sm:p-4 border-t ${cellClassName}`} style={style} tabIndex={-1}>
        {value ?? "-"}
      </TableCell>
    )
  }

  const handleMouseEnter = (row: TData, event: React.MouseEvent) => {
    if (!onHoverMessage) return
    const message = onHoverMessage(row)
    if (!message) return

    const rowElement = event.currentTarget as HTMLElement
    setActiveRowTooltip({ message, rowElement })
  }

  const handleMouseLeave = () => {
    setActiveRowTooltip(null)
  }

  //Pagination

  const activePage = pageNo ?? 1
  const [countPerPage, setCountPerPage] = useState<ItemsPerPageOption>(itemsPerPage as ItemsPerPageOption)
  const pageCount = Math.ceil(totalItems / countPerPage) || 1
  type ItemsPerPageOption = 10 | 20 | 50 | 2
  const pageCountOptions: ItemsPerPageOption[] = [10, 20, 50]

  const incrementPageCount = () => onChange(activePage + 1, countPerPage)
  const decrementPageCount = () => onChange(activePage - 1, countPerPage)

  useEffect(() => {
    if (itemsPerPage) setCountPerPage(itemsPerPage as ItemsPerPageOption)
  }, [itemsPerPage])

  useEffect(() => {
    onChange(Math.min(pageCount, activePage), countPerPage)
  }, [countPerPage, pageCount])

  const renderPageNumbers = () => {
    const items = []

    // First page
    if (activePage > 2) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={() => onChange(1, countPerPage)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded"
          >
            <span className="text-paragraph text-typography-600">1</span>
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Left ellipsis
    if (activePage > 3) {
      items.push(
        <PaginationItem key="leftEllipsis">
          <PaginationEllipsis className="flex h-[14px] w-[14px] items-start text-typography-600" />
        </PaginationItem>
      )
    }

    // Previous page
    if (activePage - 1 >= 1) {
      items.push(
        <PaginationItem key="prev">
          <PaginationLink
            onClick={decrementPageCount}
            className="flex h-[34px] w-[34px] items-center justify-center rounded"
          >
            <span className="text-paragraph text-typography-600">{activePage - 1}</span>
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Current page
    items.push(
      <PaginationItem key="current">
        <PaginationLink
          isActive
          className="flex h-[34px] w-[34px] items-center justify-center border-none bg-primary-0 text-primary-500 hover:bg-primary-100 hover:text-primary-600"
        >
          <span className="text-paragraph">{activePage}</span>
        </PaginationLink>
      </PaginationItem>
    )

    // Next page
    if (activePage + 1 <= pageCount) {
      items.push(
        <PaginationItem key="next">
          <PaginationLink
            onClick={incrementPageCount}
            className="flex h-[34px] w-[34px] items-center justify-center rounded"
          >
            <span className="text-paragraph text-typography-600">{activePage + 1}</span>
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Right ellipsis
    if (activePage < pageCount - 2) {
      items.push(
        <PaginationItem key="rightEllipsis">
          <PaginationEllipsis className="flex h-[14px] w-[14px] items-start text-typography-600" />
        </PaginationItem>
      )
    }

    // Last page
    if (activePage < pageCount - 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => onChange(pageCount, countPerPage)}
            className="flex h-[34px] w-[34px] items-center justify-center rounded"
          >
            <span className="text-paragraph text-typography-600">{pageCount}</span>
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  if (isLoading) {
    return (
      <div className={`relative w-full ${tableDivClassName}`}>
        {renderTopActions && selectedRows.length > 0 && (
          <div className="flex w-full items-center justify-between bg-white p-3">{renderTopActions(selectedRows)}</div>
        )}
        <Table className={`rounded-t-lg border-separate border-spacing-0 border border-border-200 ${className}`} style={{ pointerEvents: 'auto' }}>
          <TableHeader className={`sticky top-0 z-10 bg-gray-50 h-11 ${headerClassName}`}>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header: any) => (
                  <TableHead
                    key={header.id}
                    className={`text-secondary-800 text-xs [&:first-child]:pl-4 [&:last-child]:pr-4 [&:first-child]:rounded-tl-lg [&:last-child]:rounded-tr-lg ${headerCellClassName} ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                    style={{
                      width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : "auto",
                      minWidth: header.column.columnDef.size ? `${header.column.columnDef.size}px` : "auto",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    tabIndex={-1}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="ml-2">
                          <SortIcons
                            isSorted={header.column.getIsSorted()}
                            hasData={false}
                            onDirectSort={() => {}} // No-op for loading state
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={selectableColumns.length} className="h-2 bg-transparent" />
            </TableRow>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow
                key={index}
                className={typeof rowClassName === "function" ? rowClassName(data[index] as TData) : rowClassName}
              >
                {table.getHeaderGroups()[0].headers.map((header: any) => renderCell(header, true))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div ref={tableRef} className={`relative w-full ${tableDivClassName}`}>
      {renderTopActions && selectedRows.length > 0 && (
        <div className="flex w-full items-center justify-between bg-white p-3">{renderTopActions(selectedRows)}</div>
      )}
      <Table className={`rounded-t-lg border-separate border-spacing-0 border border-border-200 ${className}`} style={{ pointerEvents: 'auto'}}>
        <TableHeader className={`sticky top-0 z-10 bg-secondary-50 h-11 border-none ${headerClassName}`}>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header: any) => {
                const hasMultipleRows = table.getRowModel().rows.length > 1
                const canSort = header.column.getCanSort() && hasMultipleRows

                return (
                  <TableHead
                    key={header.id}
                    className={`text-secondary-800 text-xs [&:first-child]:pl-4 [&:last-child]:pr-4 [&:first-child]:rounded-tl-lg [&:last-child]:rounded-tr-lg border-none ${headerCellClassName} ${canSort ? 'cursor-pointer select-none' : ''}`}
                    style={{
                      width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : "auto",
                      minWidth: header.column.columnDef.size ? `${header.column.columnDef.size}px` : "auto",
                    }}
                    onClick={canSort ? () => handleSortChange(header.id) : undefined}
                    tabIndex={-1}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {/* {header.column.getCanSort() && (
                        <SortIcons
                          isSorted={header.column.getIsSorted()}
                          hasData={hasMultipleRows}
                          onDirectSort={() => handleSortChange(header.id)}
                        />
                      )} */}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                className={typeof rowClassName === "function" ? rowClassName(row.original as TData) : rowClassName}
                onClick={() => handleRowClick?.(row.original as TData)}
                onMouseEnter={(e) => handleMouseEnter(row.original as TData, e)}
                onMouseLeave={handleMouseLeave}
                tabIndex={-1}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell
                    key={cell.id}
                    className={`p-2 sm:p-4 border-t ${cellClassName}`}
                    tabIndex={-1}
                    style={{
                      width: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : "auto",
                      minWidth: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : "auto",
                      fontFamily: "Nunito Sans",
                      fontWeight: "400",
                      fontSize: "14px",
                      lineHeight: "19px",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={selectableColumns.length}
                className="h-full p-20 text-center hover:bg-transparent"
                tabIndex={-1}
              >
                <NoDataFound />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {activeRowTooltip && (
        <div
          className="pointer-events-none fixed z-[9999] flex max-w-[100px] items-center gap-3.5 rounded bg-black p-2 text-sm text-white sm:max-w-[150px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[250px]"
          style={{
            top:
              activeRowTooltip.rowElement.getBoundingClientRect().top +
              activeRowTooltip.rowElement.getBoundingClientRect().height / 2,
            right: 8,
            transform: "translateY(-50%)",
          }}
        >
          <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 bg-black" />
          <Info className="hidden h-3.5 w-3.5 shrink-0 md:block" />
          <span className="break-words">{activeRowTooltip.message}</span>
        </div>
      )}
      <div className={`px-4 flex bg-white h-16 rounded-b-lg border border-border-200 border-t-0 ${PaginationClassName}`}>
        {/* <p className="text-paragraph text-secondary-600 mr-auto flex items-center">
          Total Items:{' '}
          <span className="font-bold text-black ml-1">{totalItems}</span>
        </p> */}
        <div className="flex w-full items-center">
          {/* <div className="text-secondary-600 text-paragraph mr-4 flex items-center">
            <span className="mr-2">Items per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-between w-[66px] h-[38px] px-3 border border-secondary-100 rounded text-secondary-800">
                {countPerPage}
                <ChevronDown className="h-4 w-4 text-secondary-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="p-0 min-w-[66px] pt-2 pb-1">
                {pageCountOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setCountPerPage(option)}
                    className={cn(
                      "justify-center text-paragraph py-1",
                      "focus:bg-transparent hover:bg-transparent active:bg-transparent",
                      "data-[highlighted]:bg-transparent cursor-pointer"
                    )}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

          <div className="ml-4 w-full">
            <ShadcnPagination>
              <PaginationContent className="flex w-full items-center justify-between">
                <PaginationItem>
                  <Button
                    onClick={decrementPageCount}
                    disabled={activePage === 1}
                    className={`border-border-0 max-h-[44px] rounded border bg-white p-4 text-black ${
                      activePage === 1 ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="-rotate-90">
                      <ChevronUp
                        className={`h-[22px] w-[22px] ${
                          activePage === 1 ? "text-secondary-200" : "text-secondary-800"
                        }`}
                      />
                    </div>
                    <span className=" text-sm text-black">Previous</span>
                  </Button>
                </PaginationItem>
                <div className="flex items-center gap-2">{renderPageNumbers()}</div>

                <PaginationItem>
                  <Button
                    onClick={incrementPageCount}
                    disabled={activePage === pageCount}
                    className={`max-h-[44px] rounded bg-info-500 p-4 text-white ${
                      activePage === pageCount ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="text-sm text-white">Next</span>
                    <div className="-rotate-90">
                      <ChevronDown
                        className={`h-[22px] w-[22px] ${
                          activePage === pageCount ? "text-secondary-200" : "text-white"
                        }`}
                      />
                    </div>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </ShadcnPagination>
          </div>
        </div>
      </div>
    </div>
  )
}

export { DataTableWithPagination }
