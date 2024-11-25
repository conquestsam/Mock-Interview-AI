"use client";

import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link'; // Import Link here

function Interview({ params }) {
  const interviewId = React.use(params).interviewId; // Unwrap the promise


  /**Used to Get Interview Details by MockId/Interview Id */
  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const [interviewData, setInterviewData]=useState();
  const [webCamEnabled, SetWebCamEnabled]=useState(false); 
  useEffect(() => {
    console.log(interviewId);
    GetInterviewDetails();
  }, [interviewId]);

  return (
  <div className='my-10'>
    <h2 className='font-bold text-2xl'>Let's Get Started </h2>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
   
    <div className='flex flex-col my-5 gap-4 p-5 border rounded-lg'>
    <div className='flex flex-col p-5 rounded-lg border gap-5'>
    <h2 className='text-lg'>
    <strong>Job Role/Job Position: </strong>
    {interviewData ? interviewData.jobPosition : "Loading..."}
  </h2>
  <h2 className='text-lg'>
    <strong>Job Description/Tech Stack: </strong>
    {interviewData ? interviewData.jobDesc : "Loading..."}
  </h2>
  <h2 className='text-lg'>
    <strong>Years of Experience: </strong>
    {interviewData ? interviewData.jobExperience : "Loading..."}
  </h2>
    </div>
    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
      <h2 className='flex gap-2 items-center text-yellow-700'><Lightbulb /> <span><strong>Information</strong></span></h2>
      <h2 className='mt=3 text-yellow-900'> {process.env.NEXT_PUBLIC_INFORMATION} </h2>
    </div>
    </div>
    
    <div>
     {webCamEnabled? <Webcam 
     onUserMedia={()=>SetWebCamEnabled(true)}
     onUserMediaError={()=>SetWebCamEnabled(false)}
     mirrored={(true)}
     style={{
      height:300, 
      width:300
     }}
     />
     :
     <>
      <WebcamIcon className='h-72 w-full p-20 my-7 bg-secondary rounded-lg border' />
      <Button onClick={()=>SetWebCamEnabled(true)} >Enable WebCam and Microphone </Button>
      </>
     }
    <div className='flex justify-end items-end'>
    <Link href={`/dashboard/interview/${params?.interviewId || ''}/start`}>
      <Button>Start Interview</Button>
    </Link>
  </div>

    </div>
    
    </div>
   
    
    


  </div>
  );
}

export default Interview;
