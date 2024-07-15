import { FC } from "react";
import Input from "./Input";
import { EmailProps } from "./types";
import { emailRegex } from "@/utils/common-regex";
import { Sms } from "iconsax-react";

const DEFAULT_ERROR = "Invalid email format.";

const InputEmail: FC<EmailProps> = ({
  label = "Email",
  errorMessage = DEFAULT_ERROR,
  autoComplete = "email",
  ...props
}) => {
  return (
    <Input
      {...props}
      type="email"
      endContent={
        <span className="text-foreground-400">
          <Sms variant="Bold" size="24" color="currentColor" />
        </span>
      }
      regexPattern={emailRegex}
      regexError={errorMessage}
      autoComplete={autoComplete}
      label={label}
    />
  );
};

export default InputEmail;
