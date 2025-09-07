import QueryClientWithToken from "@/components/QueryClientWithToken"
import "./globals.css"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { SessionProvider } from "@/context/SessionContext"

const figtree = Figtree({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "X-CD",
  description: "X-CD is an event and hotel management system",
  applicationName: "X-CD",
}

export const ProvidersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientWithToken>
      {children}
    </QueryClientWithToken>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en" className="light">
        <body className={figtree.className}>
          <ProvidersLayout>
            {children}
          </ProvidersLayout>
        </body>
      </html>
    </SessionProvider>
  )
}
