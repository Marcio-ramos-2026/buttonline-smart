'use client'
import { Button } from "@/components/ui/button"
import { CopyPlus } from "lucide-react"
import * as fabric from 'fabric'
import { useState } from "react"
import { useEditorContext } from "@/context/editor"

export const MultipleButton = () => {
    const {canvas} = useEditorContext()

    const [buttons, setButtons] = useState<fabric.Canvas[]>([])

    const addMultiple = async () => {
        if(!canvas) return
        const canvasCopy = await canvas.clone(["cardenas_print"])
        setButtons(current => [...current,canvasCopy])
    }

    return (
        <div>
            <Button icon={<CopyPlus />} variant={'outline'} className="relative" onClick={addMultiple}>
                Multiple
                <div className="absolute -right-2 -top-2 h-6 w-6 bg-danger text-white font-bold rounded-full text-sm flex justify-center items-center">5</div>
            </Button>

            {buttons.map((item,x)=> {
                return <p>Item n {x}</p>
            })}
        </div>
    )
}