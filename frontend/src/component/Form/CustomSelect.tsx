import { useFormikContext } from "formik";
import Select from "react-select";
import makeAnimated from "react-select/animated";



type Option = {
    value: string,
    label: string,
}


type Props = {
    selectOptions: Option[],
    isMulti?: boolean,
    name: string,
    placeholder?: string
}

export const CustomSelect = ( {selectOptions, isMulti = false, name, placeholder = "Select..."} : Props) => {
  const { setFieldValue } = useFormikContext();

  const animatedComponents = makeAnimated();

  return (
    <>
        <Select
            placeholder={placeholder}
            className=" text-black w-full"
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti = {isMulti}
            options={ selectOptions }
            onChange={(val) => {
                const _val = val as Option[] | Option;
                const isArray = Array.isArray(_val);
                if (isArray) {
                  const values = _val.map((o) => o.value);
                  setFieldValue(name, values);
                } else {
                  setFieldValue(name, _val.value);
                }
                }
            }
        />
    </>
  )
}
