"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { ScrollTimeline } from "@/components/lightswind/scroll-timeline";

// Picks the `${key}_${lang}` column when it exists, otherwise falls back to
// the other language, then to the plain `${key}` column (untranslated fields
// like `title` on experiences, or `institution` on both tables).
function pickLocalized(row, key, lang) {
  const primary = row[`${key}_${lang}`];
  const fallback = lang === "en" ? row[`${key}_id`] : row[`${key}_en`];
  const plain = row[key];
  return primary || fallback || plain || "";
}

// Loads one table and maps each row into the {title, institution, period,
// description} shape ScrollTimeline expects, re-mapping whenever the
// language changes (no refetch needed — we already have both languages).
function useTimelineEvents(table, mapRow) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("id") ? "id" : "en";
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError(queryError.message);
          setStatus("error");
        } else {
          setRows(data ?? []);
          setStatus("ready");
        }
      });
    return () => {
      active = false;
    };
  }, [table]);

  const events = useMemo(
    () => rows.map((row) => mapRow(row, lang)),
    [rows, lang, mapRow],
  );

  return { events, status, error };
}

export function ExperienceEducation() {
  const { t } = useTranslation();

  const { events: educationData, status: educationStatus } = useTimelineEvents(
    "educations",
    (row, lang) => ({
      title: pickLocalized(row, "title", lang),
      institution: row.institution,
      period: row.period,
      description: pickLocalized(row, "description", lang),
    }),
  );

  const { events: experienceData, status: experienceStatus } =
    useTimelineEvents("experiences", (row, lang) => ({
      title: row.title,
      institution: row.institution,
      period: pickLocalized(row, "period", lang),
      description: pickLocalized(row, "description", lang),
    }));

  return (
    <section
      id="education"
      className="px-6 py-42 bg-background overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {educationStatus === "ready" && educationData.length > 0 && (
            <ScrollTimeline
              events={educationData}
              title={t("section.education")}
              progressIndicator={true}
              cardAlignment="right"
              connectorStyle="dot"
              cardEffect="shadow"
              revealAnimation="fade"
            />
          )}

          {experienceStatus === "ready" && experienceData.length > 0 && (
            <ScrollTimeline
              events={experienceData}
              title={t("section.experience")}
              progressIndicator={true}
              cardAlignment="right"
              connectorStyle="dot"
              cardEffect="shadow"
              revealAnimation="fade"
            />
          )}
        </div>
      </div>
    </section>
  );
}
