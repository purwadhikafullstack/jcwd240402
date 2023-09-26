import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { VscSettings } from "react-icons/vsc";

import logo from "../../../assets/images/furniforNav.png";
import AccordionFilter from "../accordion/AccordionFilter";

export default function SlideOverFilter({
  rangePriceMin,
  rangePriceMax,
  rangeWeightMin,
  rangeWeightMax,
  limitPrice,
  limitWeight,
  setSearchParams,
  searchParams,
  setCurrentPage,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => setOpen(true)}
            className=" flex justify-start items-center px-3 py-1.5 rounded-full w-fit gap-2 border-2"
          >
            <VscSettings />
            <span className="text-xs">Filter</span>
          </button>
        </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <AiFillCloseCircle
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <img
                            src={logo}
                            alt="logo"
                            className=" h-8 md:h-10 lg:h-8"
                          />
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-4 flex-1 px-4 sm:px-6">
                        <AccordionFilter
                          rangePriceMin={rangePriceMin}
                          rangePriceMax={rangePriceMax}
                          rangeWeightMin={rangeWeightMin}
                          rangeWeightMax={rangeWeightMax}
                          setSearchParams={setSearchParams}
                          searchParams={searchParams}
                          limitPrice={limitPrice}
                          limitWeight={limitWeight}
                          setCurrentPage={setCurrentPage}
                        />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
