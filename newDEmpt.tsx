{
  currentStep === 3 && (
    <>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Timings
      </h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Please Add Clinic Timing
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Morning Timings */}
        <div className="col-span-1 sm:col-span-2">
          <h3 className="text-sm font-semibold leading-6 text-gray-900">
            Morning
          </h3>
          <div className="mt-2 flex items-center space-x-4">
            <div className="w-1/3">
              <label
                htmlFor="morningStartTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Time
              </label>
              <input
                type="time"
                id="morningStartTime"
                {...register("morningStartTime")}
                autoComplete="morningStartTime"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.morningStartTime?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.morningStartTime.message}
                </p>
              )}
            </div>
            <div className="w-1/3">
              <label
                htmlFor="morningEndTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Time
              </label>
              <input
                type="time"
                id="morningEndTime"
                {...register("morningEndTime")}
                autoComplete="morningEndTime"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.morningEndTime?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.morningEndTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Evening Timings */}
        <div className="col-span-1 sm:col-span-2">
          <h3 className="text-sm font-semibold leading-6 text-gray-900">
            Evening
          </h3>
          <div className="mt-2 flex items-center space-x-4">
            <div className="w-1/3">
              <label
                htmlFor="eveningStartTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Time
              </label>
              <input
                type="time"
                id="eveningStartTime"
                {...register("eveningStartTime")}
                autoComplete="eveningStartTime"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.eveningStartTime?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.eveningStartTime.message}
                </p>
              )}
            </div>
            <div className="w-1/3">
              <label
                htmlFor="eveningEndTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Time
              </label>
              <input
                type="time"
                id="eveningEndTime"
                {...register("eveningEndTime")}
                autoComplete="eveningEndTime"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.eveningEndTime?.message && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.eveningEndTime.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
