import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { WSProvider } from './WebSocket'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <WSProvider children={children} />
      </body>
    </html>
  )
}
