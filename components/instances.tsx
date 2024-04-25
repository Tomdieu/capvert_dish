"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { getClasses, getInstancesOfClass } from '@/actions/query'
import { Dot } from 'lucide-react'
import { Label } from './ui/label'

type Props = {}

const Instances = (props: Props) => {

    const [classes, setClasses] = useState<ClassWithSubclasses>({});
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [instances, setInstances] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const removeSubclassesFromClasses = (classes: ClassWithSubclasses): ClassWithSubclasses => {
        const updatedClasses: ClassWithSubclasses = { ...classes };

        Object.keys(classes).forEach((className) => {
            classes[className].forEach((subclass) => {
                if (updatedClasses[subclass]) {
                    delete updatedClasses[subclass];
                }
            });
        });

        return updatedClasses;
    }

    useEffect(() => {
        getClasses()
            .then(classes => setClasses(removeSubclassesFromClasses(classes)))
            .catch((error) => setError(error.message))
    }, [])

    const handleClassChange = (value: string) => {
        setSelectedClass(value);
        setLoading(true);
        setError(null);
        getInstancesOfClass(value)
            .then(instances => setInstances(instances))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (selectedClass) {
            handleClassChange(selectedClass);
        }
    }, [selectedClass])



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" title='classes and instances' className="relative">
                    <span>C.I</span>
                    <span className='absolute top-0 right-0'>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                    </span>
                    <span className='sr-only'>Classes and instances</span>
                </Button>

            </DialogTrigger>
            <DialogContent className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl max-h-[600px]">
                <DialogHeader>
                    <DialogTitle>Classes And Instances</DialogTitle>
                    <DialogDescription>
                        Select a class to list its instances
                    </DialogDescription>
                </DialogHeader>
                <div className="flex w-full h-full gap-4 py-4">
                    <div className='w-4/12 h-full border-r px-5 '>
                        <ul className='flex flex-col gap-1'>
                            {Object.keys(classes).map((className, index) => (
                                <React.Fragment key={className + "_" + index}>
                                    <li className='flex items-center'>
                                        <Dot />
                                        <Button variant={selectedClass == className ? 'outline' : 'ghost'} onClick={() => setSelectedClass(className)}>{className}</Button>

                                    </li>
                                    <ol className='ml-2 flex gap-1 flex-col'>
                                        {classes[className].map((subclass, subIndex) => (
                                            <li key={`${index}-${subIndex}`} className='flex items-center'>
                                                <Dot />
                                                <Button variant={selectedClass == subclass ? 'outline' : 'ghost'} onClick={() => setSelectedClass(subclass)}>{subclass}</Button>
                                            </li>
                                        ))}
                                    </ol>
                                </React.Fragment>
                            ))}
                        </ul>

                    </div>
                    <div className='w-8/12  flex flex-col'>
                        <div className='w-full overflow-auto'>
                            {loading && <div className="flex flex-col gap-2 space-y-3 w-full">
                                <Skeleton className="w-full h-[20px] rounded-full" />
                                <Skeleton className="w-[150px] h-[20px] rounded-full" />
                                <Skeleton className="w-[100px] h-[20px] rounded-full" /> 
                                <Skeleton className="w-[50px] h-[20px] rounded-full" />
                            </div>}
                            {!loading && instances.length > 0 && (
                                <ScrollArea className='w-full h-full max-h-[500px]'>
                                    <h1 className='font-bold text-xl'>Instances of {selectedClass} <span className='text-sm'>({instances.length})</span></h1>
                                    <div className='flex gap-3 flex-wrap'>
                                        {instances.map((instance, index) => (
                                            <Badge variant="outline" className='cursor-pointer select-none' key={`${instance}_${index}`}>{instance.split('#')[1].replaceAll("_", " ").replace("/", " / ")}</Badge>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                            {selectedClass && !loading && instances.length == 0 && <h1 className='font-bold text-xl'>No instances found for {selectedClass}</h1>}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Instances