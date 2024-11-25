import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function InterviewItemCard({interview}) {
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-500'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-400'><strong>Created At: </strong>{interview.createdAt}</h2>

        <div className='flex justify-between my-5 gap-5'>
            <Link 
            href={"./dashboard/interview/"+interview?.mockId+"/feedback"}
            > 
        <Button variant="outline" className='w-full' > Feedback </Button> </Link>
        
        
        <Button className='w-full'> Start </Button>
        </div>
        
    </div>
  )
}

export default InterviewItemCard