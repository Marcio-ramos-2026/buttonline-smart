import { useRef, useEffect, useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { CanvasObjectType } from "./type"

const MIN_FONT_SIZE = 1
const MAX_FONT_SIZE = 200

export const HandleFontSize = ({ canvas, object }: CanvasObjectType) => {
  const [fontSize, setFontSize] = useState<number | "">("")
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!object) return
    //@ts-ignore
    setFontSize(object.fontSize ?? "")
  }, [object])

  const updateFontSize = (size: number | "") => {
    if (!object || !canvas) return
    if (size === "") {
      setFontSize("")
      return
    }
    const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, size))
    setFontSize(clamped)

    object.set({ fontSize: clamped })
    //@ts-ignore
    canvas.fire("modified", { target: object })
    canvas.renderAll()
  }

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!val) {
      updateFontSize("")
      return
    }
    const num = Number(val)
    if (isNaN(num)) return
    updateFontSize(num)
  }

  // Handle input blur: close popover only if new focus is outside popover
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay to allow next focus event
    setTimeout(() => {
      const activeEl = document.activeElement
      if (
        popoverRef.current &&
        (activeEl === null || !popoverRef.current.contains(activeEl))
      ) {
        setOpen(false)
      }
    }, 0)
  }

  // Handle popover content blur: same logic
  const handlePopoverBlur = () => {
    setTimeout(() => {
      const activeEl = document.activeElement
      if (
        popoverRef.current &&
        (activeEl === null || !popoverRef.current.contains(activeEl))
      ) {
        setOpen(false)
      }
    }, 0)
  }

  return (
    <Popover open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
  <PopoverTrigger asChild>
    <Input
      type="number"
      min={MIN_FONT_SIZE}
      max={MAX_FONT_SIZE}
      value={fontSize === "" ? "" : fontSize}
      onChange={handleChangeSize}
      className="w-20 text-center py-1 cursor-pointer"
      aria-label="Font size input"
      // REMOVE onFocus handler completely
      onBlur={handleInputBlur}
    />
  </PopoverTrigger>

  <PopoverContent
    side="bottom"
    align="center"
    className="w-48 p-4"
    ref={popoverRef}
    tabIndex={-1}
    onBlur={handlePopoverBlur}
  >
    <Slider
      min={MIN_FONT_SIZE}
      max={MAX_FONT_SIZE}
      step={1}
      value={fontSize === "" ? [MIN_FONT_SIZE] : [fontSize]}
      onValueChange={(val) => {
        if (val.length) updateFontSize(val[0])
      }}
      aria-label="Font size slider"
    />
  </PopoverContent>
</Popover>
  )
}
