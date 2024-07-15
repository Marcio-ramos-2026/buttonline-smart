'use client'

import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useAdminContext } from "@/context/admin";
import { ReactNode } from "react";
  
export default function NavbarMobile({ children }: { children: ReactNode }){
    const ctx = useAdminContext()

    return (
        <Dialog open={ctx?.mobile.navbar} onClose={() => ctx?.mobile.closeNavbar()} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-[50%] flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={ctx?.mobile.closeNavbar} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {children}
            </DialogPanel>
          </div>
        </Dialog>
    )
}

export function ButtonNavbarMobile () {
  const ctx = useAdminContext()
  
  return (
    <button type="button" onClick={ctx?.mobile.openNavbar} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
    </button>
  )
}