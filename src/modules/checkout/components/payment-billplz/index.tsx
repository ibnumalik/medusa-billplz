import { RadioGroup } from "@headlessui/react"
import { MEDUSA_BACKEND_URL } from "@lib/config"
import Radio from "@modules/common/components/radio"
import Alert from "@modules/common/icons/alert"
import { useUpdatePaymentSession } from "medusa-react"
import { useState } from "react"
import { useQuery } from "react-query"

interface FpxList {
  name: string
  active: boolean
  label: string
}

const fetchFpxList = async () => {
  return await fetch(MEDUSA_BACKEND_URL + "/billplz/fpx_banks").then((res) =>
    res.json()
  )
}

const PaymentBillplz = ({ cart }: any) => {
  const {
    data: banks,
    isLoading,
    error,
    isSuccess,
  } = useQuery<FpxList[]>(["fpxList"], () => fetchFpxList())
  const [selected, setSelected] = useState("")
  const { mutate } = useUpdatePaymentSession(cart.id)

  function updatePaymentMethod(value: string) {
    mutate({ provider_id: "billplz", data: { billplz_ref: value } })

    setSelected(value)
  }

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
          <RadioGroup
            value={selected}
            onClick={(e) => e.stopPropagation()}
            onChange={updatePaymentMethod}
          >
            {banks.map((bank) => (
              <RadioGroup.Option key={bank.name} value={bank.name}>
                <div className="flex items-center gap-x-4">
                  <Radio checked={selected === bank.name} />
                  <span className="text-base-regular flex items-center">
                    <span
                      className={`w-1 h-1 rounded-full inline-block mr-3 ${
                        bank.active ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {bank.label}
                  </span>
                </div>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  }

  return null
}

export default PaymentBillplz
