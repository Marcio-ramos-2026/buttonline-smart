import { useState } from "react"
import { Input, InputProps } from "./input"
import { Eye, EyeOff } from "lucide-react"

interface InputPassword extends Omit<InputProps, 'type' | 'addonAfter' | 'icon'> {}

export const InputPassword = ({ ...props }: InputPassword) => {
    const [visible, setVisible] = useState(false)

    const Icon = visible ? (
        <Eye />
    ) : (
        <EyeOff />
    )

    return <Input {...props} type={visible ? 'text' : 'password'} iconPlacement="end" icon={<button type="button" onClick={() => setVisible(prev => !prev)}>{Icon}</button>} />
}