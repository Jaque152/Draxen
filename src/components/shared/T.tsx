"use client";

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export function T({ children }: { children: string }) {
  const locale = useLocale();
  const [translated, setTranslated] = useState(children);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!children || locale === 'es') {
      setTranslated(children);
      return;
    }

    async function fetchTranslation() {
      setLoading(true);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: children, targetLang: locale }),
        });
        const data = await res.json();
        setTranslated(data.translated);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchTranslation();
  }, [children, locale]);

  return (
    <span className={loading ? "opacity-50 animate-pulse" : ""}>
      {translated}
    </span>
  );
}