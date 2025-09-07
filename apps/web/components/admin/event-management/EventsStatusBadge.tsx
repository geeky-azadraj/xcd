interface EventStatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE'
}

function EventStatusBadge({ status }: EventStatusBadgeProps) {
  return (
    <div className={`
      inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium
      ${status === 'ACTIVE' 
        ? 'bg-green-50 text-green-700' 
        : 'bg-white text-gray-900'
      }
    `}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'ACTIVE' ? 'bg-green-700' : 'bg-gray-900'
      }`} />
      {status}
    </div>
  )
}

export default EventStatusBadge;