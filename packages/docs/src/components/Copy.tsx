import toast from "react-hot-toast";

export const Copy = ({ text }: { text: string }) => (
  <code
    className="pointer"
    onClick={() => {
      toast.success(text + " copied to clipboard");
      navigator.clipboard.writeText(text);
    }}>
    {text}
  </code>
);
