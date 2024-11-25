"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard'

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (user) GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        try {
            const userEmail = user?.primaryEmailAddress?.emailAddress; // Extract email
            if (!userEmail) {
                console.error("User email is not defined.");
                return;
            }

            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, userEmail)) // Correct comparison
                .orderBy(desc(MockInterview.id));

            console.log(result);
            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interview list:", error);
        }
    };

    return (
        <div>
            <h2 className='font-medium text-lg'>Previous Mock Interviews</h2>
            {/* Render interview list here */}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {interviewList&&interviewList.map ((interview,index)=>(
                     <InterviewItemCard 
                     interview={interview}
                     key={index} />
                ))}
            </div>
        </div>
    );
}

export default InterviewList;
