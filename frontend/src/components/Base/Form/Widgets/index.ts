import Input from "./Input";
import InputEmail from "./InputEmail";
import InputMask from "./InputMask";
import InputPhone from "./InputPhone";

export const WidgetsMap = {
  input: Input,
  email: InputEmail,
  mask: InputMask,
  phone: InputPhone,
};

export type Widgets = typeof WidgetsMap;

export default WidgetsMap;
