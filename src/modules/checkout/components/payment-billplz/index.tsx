import { RadioGroup } from "@headlessui/react"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import Radio from "@modules/common/components/radio"
import Alert from "@modules/common/icons/alert"
import { useState } from "react"
import { useQuery } from "react-query"

interface FpxList {
  name: string
  active: boolean
  label: string
}

const fetchFpxList = async () => {
  return await fetch(MEDUSA_BACKEND_URL + "/billplz/fpx_banks").then((res) => {
    console.log({ res })

    return res.json()
  })
}

const PaymentBillplz = () => {
  const {
    data: banks,
    isLoading,
    error,
    isSuccess,
  } = useQuery<FpxList[]>(["fpxList"], () => fetchFpxList())
  const [selected, setSelected] = useState()

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return (
      <div className="flex items-center gap-x-2 bg-red-100 w-full p-2">
        <Alert size={16} className="text-red-700" />
        <span className="text-small-regular text-red-700">
          <span className="font-semibold">Error:</span> Failed to fetch FPX
          list. Reason: {(error as any).message}
        </span>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-x-2 w-full p-2">
          <RadioGroup value={selected} onChange={setSelected}>
            {banks.map((bank) => (
              <RadioGroup.Option key={bank.name} value={bank.name}>
                <div className="flex items-center gap-x-4">
                  <Radio checked={selected === bank.name} />
                  <span className="text-base-regular">{bank.label}</span>
                </div>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  }
}

export default PaymentBillplz
