import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full pt-10">
      <SignIn afterSignOutUrl="/"/>
    </div>
  )
}