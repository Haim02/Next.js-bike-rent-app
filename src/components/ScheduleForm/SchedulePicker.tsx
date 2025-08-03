"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/he";
import isToday from "dayjs/plugin/isToday";
import { useSession } from "next-auth/react";
import Loading from "../loading/Loading";

dayjs.extend(isToday);
dayjs.locale("he");

const START_HOUR = 6;
const END_HOUR = 24;
const MAX_HOURS_SELECTION = 5;

interface Product {
  id: String;
  authorId: String;
}

interface WeeklySchedulePickerProps {
  productId: string;
  product?: Product;
}

interface SelectedDateTime {
  date: Dayjs | null;
  hours: string[];
}

interface AvailableHours {
  [date: string]: string[];
}

interface BookedHours {
  [date: string]: string[];
}

export default function SchedulePicker({
  productId,
  product,
}: WeeklySchedulePickerProps) {
  const { data: session, status } = useSession();
  const [pending, startTransition] = useTransition();
  const [selectedDateTime, setSelectedDateTime] = useState<SelectedDateTime>({
    date: null,
    hours: [],
  });
  const [availableHours, setAvailableHours] = useState<AvailableHours>({});
  const [bookedHours, setBookedHours] = useState<BookedHours>({});
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const weekDays: Dayjs[] = useMemo(() => {
    const today = dayjs();
    const days: Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(today.add(i, "day"));
    }
    return days;
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!showSchedule || !productId) return;

      const newAvailableHours: AvailableHours = {};
      const newBookedHours: BookedHours = {};

      for (const day of weekDays) {
        const dateString = day.format("YYYY-MM-DD");

        try {
          const bookedRes = await fetch(
            `/api/product/${productId}/booked-hours?date=${dateString}`
          );
          if (bookedRes.ok) {
            const hours: string[] = await bookedRes.json();
            newBookedHours[dateString] = hours;
          } else {
            console.error(
              `Failed to fetch booked hours for ${dateString}: ${bookedRes.statusText}`
            );
            newBookedHours[dateString] = [];
          }
        } catch (error) {
          console.error(
            `Error fetching booked hours for ${dateString}:`,
            error
          );
          newBookedHours[dateString] = [];
        }

        try {
          const availableRes = await fetch(
            `/api/product/${productId}/available?date=${dateString}`
          );
          if (availableRes.ok) {
            const hours: string[] = await availableRes.json();
            newAvailableHours[dateString] = hours;
          } else {
            console.error(
              `Failed to fetch available hours for ${dateString}: ${availableRes.statusText}`
            );
            newAvailableHours[dateString] = [];
          }
        } catch (error) {
          console.error(
            `Error fetching available hours for ${dateString}:`,
            error
          );
          newAvailableHours[dateString] = [];
        }
      }
      setBookedHours(newBookedHours);
      setAvailableHours(newAvailableHours);
    };

    if (showSchedule && productId) {
      fetchScheduleData();
    }
  }, [weekDays, productId, showSchedule]);

  const handleTimeSlotClick = (day: Dayjs, hour: string) => {
    const clickedDateString = day.format("YYYY-MM-DD");

    if (
      !selectedDateTime.date ||
      selectedDateTime.date.format("YYYY-MM-DD") !== clickedDateString
    ) {
      setSelectedDateTime({ date: day, hours: [hour] });
    } else {
      const currentHours = [...selectedDateTime.hours];
      const hourIndex = currentHours.indexOf(hour);

      if (hourIndex > -1) {
        currentHours.splice(hourIndex, 1);
      } else {
        if (currentHours.length < MAX_HOURS_SELECTION) {
          currentHours.push(hour);
          currentHours.sort();
        } else {
          alert(`ניתן לבחור עד ${MAX_HOURS_SELECTION} שעות בלבד.`);
          return;
        }
      }
      setSelectedDateTime({ ...selectedDateTime, hours: currentHours });
    }
  };

  const handleSubmit = async () => {
    if (!selectedDateTime.date || selectedDateTime.hours.length === 0) {
      alert("אנא בחר תאריך ולפחות שעה אחת.");
      return;
    }

    const productAuthorId: string = "some_author_id_from_product_prop_or_api";

    if (!session?.user?.id) {
      alert("יש להתחבר כדי לשלוח בקשה.");
      return;
    }

    try {
      startTransition(async () => {
        const res = await fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            fromUserId: session.user.id,
            toUserId: product.authorId,
            date: selectedDateTime.date.format("YYYY-MM-DD"),
            hours: selectedDateTime.hours,
            content: `מבקש להשכיר בתאריך ${selectedDateTime.date.format(
              "DD.MM.YY"
            )} בשעות: ${selectedDateTime.hours.join(", ")}`,
          }),
        });

        if (res.ok) {
          alert("הבקשה נשלחה בהצלחה!");
          setSelectedDateTime({ date: null, hours: [] });
          setShowSchedule(false);
          setAvailableHours({});
          setBookedHours({});
        } else {
          const errorData: { message?: string } = await res.json();
          alert(`שגיאה בשליחת הבקשה: ${errorData.message || res.statusText}`);
        }
      });
    } catch (error) {
      console.error("שגיאה בשליחת הבקשה:", error);
      alert("אירעה שגיאה בלתי צפויה בעת שליחת הבקשה.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md rtl">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-700">
        בחר תאריך ושעות
      </h2>

      {!showSchedule && (
        <div className="text-center">
          <button
            onClick={() => setShowSchedule(true)}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            בחר תאריך ושעות
          </button>
        </div>
      )}

      {showSchedule && (
        <>
          <div className="overflow-x-auto">
            <div className="flex flex-nowrap items-start">
              <div className="flex-shrink-0 w-20 pt-10 border-l border-gray-200">
                {Array.from({ length: END_HOUR - START_HOUR }).map(
                  (_, hourIndex) => {
                    const hour: number = START_HOUR + hourIndex;
                    return (
                      <div
                        key={`hour-label-${hour}`}
                        className="h-12 flex items-center justify-center text-sm font-medium text-gray-600 border-b border-gray-100"
                      >
                        {dayjs().hour(hour).format("HH:00")}
                      </div>
                    );
                  }
                )}
              </div>

              {weekDays.map((day: Dayjs) => (
                <div
                  key={day.format("YYYY-MM-DD")}
                  className="flex-shrink-0 w-40 text-center border-l border-gray-200"
                >
                  <div
                    className={`p-2 border-b-2 ${
                      day.isToday()
                        ? "border-teal-500 text-teal-700 font-bold"
                        : "border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="text-lg">{day.format("dddd")}</div>
                    <div className="text-sm text-gray-600">
                      {day.format("DD.MM")}
                    </div>
                  </div>
                  <div>
                    {Array.from({ length: END_HOUR - START_HOUR }).map(
                      (_, hourIndex) => {
                        const hour: number = START_HOUR + hourIndex;
                        const formattedHour: string = dayjs()
                          .hour(hour)
                          .format("HH:00");
                        const dateString: string = day.format("YYYY-MM-DD");

                        const isAvailableGlobally: boolean =
                          availableHours[dateString]?.includes(formattedHour) ||
                          false;
                        const isBooked: boolean =
                          bookedHours[dateString]?.includes(formattedHour) ||
                          false;

                        const isSelectedDate: boolean =
                          selectedDateTime.date?.format("YYYY-MM-DD") ===
                          dateString;
                        const isHourSelected: boolean =
                          isSelectedDate &&
                          selectedDateTime.hours.includes(formattedHour);

                        const isPast: boolean =
                          day.isSame(dayjs(), "day") &&
                          dayjs().hour(hour).isBefore(dayjs());

                        const isDisabled: boolean =
                          isPast ||
                          isBooked ||
                          (selectedDateTime.date && !isSelectedDate) ||
                          (isSelectedDate &&
                            !isHourSelected &&
                            selectedDateTime.hours.length >=
                              MAX_HOURS_SELECTION);

                        return (
                          <button
                            key={`${dateString}-${formattedHour}`}
                            onClick={() =>
                              handleTimeSlotClick(day, formattedHour)
                            }
                            disabled={isDisabled}
                            className={`
                            w-full h-12 flex items-center justify-center text-sm border-b border-gray-100
                            ${
                              isHourSelected
                                ? "bg-teal-600 text-white font-semibold"
                                : ""
                            }
                            ${
                              !isHourSelected &&
                              isAvailableGlobally &&
                              !isBooked &&
                              !isPast &&
                              !isDisabled
                                ? "bg-white hover:bg-teal-100 text-gray-800"
                                : ""
                            }
                            ${
                              isBooked && !isHourSelected
                                ? "bg-red-200 text-red-700 cursor-not-allowed line-through"
                                : ""
                            } {/* שעה תפוסה - אדום */}
                            ${
                              isPast && !isBooked
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                : ""
                            } {/* שעה עברה - אפור */}
                            ${
                              !isAvailableGlobally && !isBooked && !isPast
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : ""
                            } {/* אם לא זמין מגלובלי */}
                            ${
                              isDisabled &&
                              !isBooked &&
                              !isPast &&
                              !isHourSelected
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : ""
                            } {/* שינוי נוסף אם שעה מושבתת מסיבה אחרת */}
                          `}
                          >
                            {formattedHour}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={
                !selectedDateTime.date || selectedDateTime.hours.length === 0
              }
              className="bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {selectedDateTime.date && selectedDateTime.hours.length > 0
                ? `שלח בקשה לתאריך ${selectedDateTime.date.format(
                    "DD.MM.YY"
                  )} בשעות: ${selectedDateTime.hours.join(", ")}`
                : "בחר שעות לשליחת בקשה"}
              {pending && <Loading />}
            </button>
            <button
              onClick={() => {
                setShowSchedule(false);
                setSelectedDateTime({ date: null, hours: [] });
                setAvailableHours({});
                setBookedHours({});
              }}
              className="mt-4 mr-2 bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              ביטול
            </button>
          </div>
        </>
      )}
    </div>
  );
}
