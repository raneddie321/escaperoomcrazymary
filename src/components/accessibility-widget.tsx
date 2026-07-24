import { useEffect, useState } from "react";
import { Accessibility, Eye, Link as LinkIcon, Minus, Plus, RotateCcw, Type } from "lucide-react";

type AccessibilitySettings = {
  largeText: boolean;
  highContrast: boolean;
  readableFont: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
};

const defaultSettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  readableFont: false,
  underlineLinks: false,
  reduceMotion: false,
};

const storageKey = "crazy-mary-accessibility";

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large-text", settings.largeText);
    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-readable-font", settings.readableFont);
    root.classList.toggle("a11y-underline-links", settings.underlineLinks);
    root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key: keyof AccessibilitySettings) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="accessibility-widget print:hidden">
      {open && (
        <section className="accessibility-panel" aria-label="תפריט נגישות">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
            <div>
              <div className="font-display text-lg">נגישות</div>
              <div className="text-xs text-muted-foreground">התאמות תצוגה מיידיות</div>
            </div>
            <button
              type="button"
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setSettings(defaultSettings)}
            >
              <RotateCcw className="inline h-3.5 w-3.5" aria-hidden /> איפוס
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            <A11yToggle active={settings.largeText} icon={Plus} label="הגדלת טקסט" onClick={() => toggle("largeText")} />
            <A11yToggle active={settings.highContrast} icon={Eye} label="ניגודיות גבוהה" onClick={() => toggle("highContrast")} />
            <A11yToggle active={settings.readableFont} icon={Type} label="פונט קריא" onClick={() => toggle("readableFont")} />
            <A11yToggle active={settings.underlineLinks} icon={LinkIcon} label="הדגשת קישורים" onClick={() => toggle("underlineLinks")} />
            <A11yToggle active={settings.reduceMotion} icon={Minus} label="הפחתת תנועה" onClick={() => toggle("reduceMotion")} />
          </div>
        </section>
      )}

      <button
        type="button"
        className="accessibility-trigger"
        aria-label={open ? "סגירת תפריט נגישות" : "פתיחת תפריט נגישות"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Accessibility className="h-6 w-6" aria-hidden />
      </button>
    </div>
  );
}

function A11yToggle({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Plus;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`accessibility-option ${active ? "is-active" : ""}`} onClick={onClick}>
      <Icon className="h-4 w-4" aria-hidden />
      <span>{label}</span>
      <span className="mr-auto text-xs">{active ? "פעיל" : "כבוי"}</span>
    </button>
  );
}
