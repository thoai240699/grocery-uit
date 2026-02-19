import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const TestShadcnPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🎉 shadcn/ui Setup Test</h1>
      
      <Card className="w-96">
        <CardHeader>
          <CardTitle>shadcn/ui Components Test</CardTitle>
          <CardDescription>
            Các component đã được cài đặt thành công!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Test input component..." />
          <div className="flex gap-2">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestShadcnPage