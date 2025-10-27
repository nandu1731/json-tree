import Header from '@/components/header'
import JsonTreeLayout from '@/components/jsonTreeLayout'
import '@xyflow/react/dist/style.css'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="bg-white p-8">
        <Header />
        <JsonTreeLayout />
      </div>
    </div>
  )
}
