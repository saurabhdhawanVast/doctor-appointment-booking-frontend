"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import useDoctorStore from "@/store/useDoctorStoree";

interface ManageAppointmentsProps {
  params: {
    doctorId: string;
  };
}

const ManageAppointments = ({ params }: ManageAppointmentsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slotToCancel, setSlotToCancel] = useState<{
    date: Date;
    slotId: string;
  } | null>(null);
  const [dateToCancelAll, setDateToCancelAll] = useState<Date | null>(null);

  const { doctorId } = params;

  const {
    availableDates,
    slotsByDate,
    fetchAvailableDates,
    cancelSlot,
    cancelAllSlots,
  } = useDoctorStore((state) => ({
    availableDates: state.availableDates,
    slotsByDate: state.slotsByDate,
    fetchAvailableDates: state.fetchAvailableDates,
    cancelSlot: state.cancelSlot,
    cancelAllSlots: state.cancelAllSlots,
  }));

  useEffect(() => {
    if (doctorId) {
      const fetchAppointments = async () => {
        try {
          await fetchAvailableDates(doctorId);
        } catch (error) {
          setError("Failed to load appointments");
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
      console.log(slotsByDate);
    }
  }, [doctorId, fetchAvailableDates]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(
      selectedDate && selectedDate.toISOString() === date.toISOString()
        ? null
        : date
    );
  };

  const openCancelSlotModal = (date: Date, slotId: string) => {
    setSlotToCancel({ date, slotId });
    const modal = document.getElementById(
      "cancelSlotModal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const openCancelAllSlotsModal = (date: Date) => {
    setDateToCancelAll(date);
    const modal = document.getElementById(
      "cancelAllSlotsModal"
    ) as HTMLDialogElement;
    modal?.showModal();
  };

  const confirmCancelSlot = async () => {
    if (slotToCancel) {
      try {
        await cancelSlot(doctorId, slotToCancel.date, slotToCancel.slotId);
        setSlotToCancel(null);
      } catch (error) {
        setError("Failed to cancel slot");
      }
    }
    const modal = document.getElementById(
      "cancelSlotModal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  const confirmCancelAllSlots = async () => {
    if (dateToCancelAll) {
      try {
        await cancelAllSlots(doctorId, dateToCancelAll);
        setDateToCancelAll(null);
        setSelectedDate(null);
      } catch (error) {
        setError("Failed to cancel all slots");
      }
    }
    const modal = document.getElementById(
      "cancelAllSlotsModal"
    ) as HTMLDialogElement;
    modal?.close();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Your Appointments</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {availableDates.length > 0 ? (
          availableDates.map(({ date, slots }) => (
            <div
              key={date.toISOString()}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-start"
            >
              <div className="text-lg font-semibold text-gray-800">
                {format(date, "dd-MM-yyyy")}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDateClick(date)}
                  className={`btn rounded-3xl ${
                    selectedDate &&
                    selectedDate.toISOString() === date.toISOString()
                      ? "bg-red-500"
                      : "bg-blue-500"
                  } text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors`}
                >
                  {selectedDate &&
                  selectedDate.toISOString() === date.toISOString()
                    ? "Hide Slots"
                    : "View Slots"}
                </button>
                <button
                  onClick={() => openCancelAllSlotsModal(date)}
                  className="btn rounded-3xl btn-error rounded transition-colors"
                >
                  Cancel All Slots
                </button>
              </div>
              {selectedDate?.toISOString() === date.toISOString() && (
                <div className="mt-4 w-full">
                  {slotsByDate[date.toISOString()]?.length > 0 ? (
                    slotsByDate[date.toISOString()].map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-gray-100 border border-gray-200 rounded-lg shadow-sm p-2 mb-2 flex justify-between items-center"
                      >
                        <div>
                          <span className="text-gray-800 mr-2">
                            {slot.time}
                          </span>
                          <span
                            className={`text-sm ${
                              slot.status === "cancelled"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {slot.status
                              ? slot.status.charAt(0).toUpperCase() +
                                slot.status.slice(1)
                              : "Unknown"}
                          </span>
                        </div>
                        {slot.status !== "cancelled" && (
                          <button
                            onClick={() => openCancelSlotModal(date, slot.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No slots available</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            No appointments available
          </div>
        )}
      </div>

      {/* Modal for canceling a single slot */}
      <dialog id="cancelSlotModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Cancellation</h3>
          <p className="py-4">Are you sure you want to cancel this slot?</p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={confirmCancelSlot}>
              Confirm
            </button>
            <button
              className="btn"
              onClick={() => {
                const modal = document.getElementById(
                  "cancelSlotModal"
                ) as HTMLDialogElement;
                modal?.close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal for canceling all slots for a date */}
      <dialog id="cancelAllSlotsModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Cancellation</h3>
          <p className="py-4">
            Are you sure you want to cancel all slots for this date?
          </p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={confirmCancelAllSlots}>
              Confirm
            </button>
            <button
              className="btn"
              onClick={() => {
                const modal = document.getElementById(
                  "cancelAllSlotsModal"
                ) as HTMLDialogElement;
                modal?.close();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ManageAppointments;
