// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// interface TextareaWithButtonProps {
//   className?: string;
// }

// const TextareaWithButton: React.FC<TextareaWithButtonProps> = ({
//   className,
// }) => {
//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     // Handle form submission logic here
//     console.log("clicked");
//   };

//   return (
//     <form onSubmit={handleSubmit} className={`grid w-full gap-2 ${className}`}>
//       <Textarea placeholder="Type your message here." />
//       <Button type="submit">Send message</Button>
//     </form>
//   );
// };

// export default TextareaWithButton;
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleArrowUp } from 'lucide-react'

interface InputWithButtonProps {
  onSend: (message: string) => void;
}

export function InputWithButton({ onSend }: InputWithButtonProps) {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    console.log("default prevented")
    event.preventDefault()
    // Handle form submission logic here
    console.log("clicked")
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input 
        placeholder="What are you interested in?" 
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button type="submit" size="icon"> 
        <CircleArrowUp className="h-7 w-7"/> 
      </Button>
    </form>
  )
}

