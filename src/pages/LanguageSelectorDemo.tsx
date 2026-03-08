import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Star, X, Search, Plus, ChevronDown, GripVertical, Globe, Check } from "lucide-react";

const ALL_LANGUAGES = [
  "Afrikaans","Albanian","Amharic","Arabic","Armenian","Azerbaijani","Basque","Belarusian","Bengali","Bosnian",
  "Bulgarian","Burmese","Catalan","Cebuano","Chinese (Simplified)","Chinese (Traditional)","Croatian","Czech",
  "Danish","Dutch","English","Esperanto","Estonian","Filipino","Finnish","French","Galician","Georgian","German",
  "Greek","Gujarati","Haitian Creole","Hausa","Hawaiian","Hebrew","Hindi","Hmong","Hungarian","Icelandic","Igbo",
  "Indonesian","Irish","Italian","Japanese","Javanese","Kannada","Kazakh","Khmer","Kinyarwanda","Korean","Kurdish",
  "Kyrgyz","Lao","Latin","Latvian","Lithuanian","Luxembourgish","Macedonian","Malagasy","Malay","Malayalam","Maltese",
  "Maori","Marathi","Mongolian","Nepali","Norwegian","Odia","Pashto","Persian","Polish","Portuguese","Punjabi",
  "Romanian","Russian","Samoan","Scottish Gaelic","Serbian","Sesotho","Shona","Sindhi","Sinhala","Slovak","Slovenian",
  "Somali","Spanish","Sundanese","Swahili","Swedish","Tajik","Tamil","Tatar","Telugu","Thai","Turkish","Turkmen",
  "Ukrainian","Urdu","Uyghur","Uzbek","Vietnamese","Welsh","Xhosa","Yiddish","Yoruba","Zulu"
];

function useLanguageState() {
  const [selected, setSelected] = useState<string[]>(["English", "Spanish"]);
  const [defaultLang, setDefaultLang] = useState("English");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => ALL_LANGUAGES.filter(l => l.toLowerCase().includes(search.toLowerCase()) && !selected.includes(l)),
    [search, selected]
  );

  const allFiltered = useMemo(
    () => ALL_LANGUAGES.filter(l => l.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const add = (lang: string) => {
    const updated = [...selected, lang];
    setSelected(updated);
    if (updated.length === 1) setDefaultLang(lang);
    setSearch("");
  };

  const remove = (lang: string) => {
    const updated = selected.filter(l => l !== lang);
    setSelected(updated);
    if (defaultLang === lang && updated.length > 0) setDefaultLang(updated[0]);
  };

  const toggle = (lang: string) => {
    if (selected.includes(lang)) remove(lang);
    else add(lang);
  };

  return { selected, defaultLang, setDefaultLang, search, setSearch, filtered, allFiltered, add, remove, toggle };
}

/* ─── Variant 1: Badge chips with popover dropdown ─── */
function Variant1() {
  const { selected, defaultLang, setDefaultLang, search, setSearch, filtered, add, remove } = useLanguageState();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Variant 1 — Chip Badges + Popover</CardTitle>
        <CardDescription>Selected languages as removable badge chips. Add via a popover search dropdown.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {selected.map(lang => (
            <Badge key={lang} variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs font-medium">
              <Tooltip delayDuration={600}>
                <TooltipTrigger asChild>
                  <button onClick={() => setDefaultLang(lang)} className="shrink-0">
                    <Star className={`h-3 w-3 transition-colors ${defaultLang === lang ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {defaultLang === lang ? "Default language" : "Set as default language"}
                </TooltipContent>
              </Tooltip>
              {lang}
              <button onClick={() => remove(lang)} className="shrink-0 hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="h-7 px-2.5 rounded-md border border-dashed border-muted-foreground/30 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add language
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="flex items-center gap-2 border-b pb-2 mb-1">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search languages..." className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" autoFocus />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {filtered.length === 0 ? <p className="text-xs text-muted-foreground p-2 text-center">No languages found</p> : filtered.map(lang => (
                  <button key={lang} onClick={() => add(lang)} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors">{lang}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Variant 2: Combobox-style inline input ─── */
function Variant2() {
  const { selected, defaultLang, setDefaultLang, search, setSearch, filtered, add, remove } = useLanguageState();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Variant 2 — Inline Combobox</CardTitle>
        <CardDescription>Type directly into the input to search. Selected languages appear as chips inside the field.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div
            className="flex flex-wrap items-center gap-1.5 min-h-[40px] rounded-md border border-input bg-background px-3 py-1.5 cursor-text"
            onClick={() => setOpen(true)}
          >
            {selected.map(lang => (
              <span key={lang} className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs font-medium">
                <Tooltip delayDuration={600}>
                  <TooltipTrigger asChild>
                    <button onClick={(e) => { e.stopPropagation(); setDefaultLang(lang); }} className="shrink-0">
                      <Star className={`h-2.5 w-2.5 ${defaultLang === lang ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"}`} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">{defaultLang === lang ? "Default language" : "Set as default"}</TooltipContent>
                </Tooltip>
                {lang}
                <button onClick={(e) => { e.stopPropagation(); remove(lang); }} className="hover:text-destructive"><X className="h-2.5 w-2.5" /></button>
              </span>
            ))}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder={selected.length === 0 ? "Search languages..." : ""}
              className="flex-1 min-w-[100px] text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
          {open && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
              <ScrollArea className="max-h-48">
                <div className="p-1 space-y-0.5">
                  {filtered.length === 0 ? <p className="text-xs text-muted-foreground p-2 text-center">No results</p> : filtered.slice(0, 20).map(lang => (
                    <button key={lang} onMouseDown={(e) => { e.preventDefault(); add(lang); }} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors">{lang}</button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Variant 3: Checkbox list with search ─── */
function Variant3() {
  const { selected, defaultLang, setDefaultLang, search, setSearch, allFiltered, toggle } = useLanguageState();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Variant 3 — Dropdown Checklist</CardTitle>
        <CardDescription>A trigger button reveals a searchable checklist. Star a language from the selected list below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-sm font-normal">
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {selected.length === 0 ? "Select languages..." : `${selected.length} language${selected.length > 1 ? "s" : ""} selected`}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-2 border-b">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search languages..." className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" autoFocus />
              </div>
            </div>
            <ScrollArea className="max-h-56">
              <div className="p-1 space-y-0.5">
                {allFiltered.map(lang => (
                  <label key={lang} className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-accent cursor-pointer transition-colors text-sm">
                    <Checkbox checked={selected.includes(lang)} onCheckedChange={() => toggle(lang)} />
                    {lang}
                    {selected.includes(lang) && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {defaultLang === lang ? "default" : ""}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {selected.length > 0 && (
          <div className="space-y-1">
            {selected.map(lang => (
              <div key={lang} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={defaultLang === lang ? "font-semibold" : ""}>{lang}</span>
                  {defaultLang === lang && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">Default</Badge>}
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip delayDuration={600}>
                    <TooltipTrigger asChild>
                      <button onClick={() => setDefaultLang(lang)} className="p-1 rounded hover:bg-accent transition-colors">
                        <Star className={`h-3.5 w-3.5 ${defaultLang === lang ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-muted-foreground"}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">{defaultLang === lang ? "Default language" : "Set as default"}</TooltipContent>
                  </Tooltip>
                  <button onClick={() => toggle(lang)} className="p-1 rounded hover:bg-accent hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Variant 4: Two-column transfer list ─── */
function Variant4() {
  const { selected, defaultLang, setDefaultLang, search, setSearch, filtered, add, remove } = useLanguageState();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Variant 4 — Side-by-Side Panels</CardTitle>
        <CardDescription>Available languages on the left, selected on the right. Click to transfer between panels.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {/* Available */}
          <div className="rounded-lg border">
            <div className="p-2 border-b">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <p className="px-2 pt-1.5 text-[10px] uppercase font-medium text-muted-foreground tracking-wider">Available</p>
            <ScrollArea className="h-44">
              <div className="p-1 space-y-0.5">
                {filtered.slice(0, 30).map(lang => (
                  <button key={lang} onClick={() => add(lang)} className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-accent transition-colors flex items-center justify-between group">
                    {lang}
                    <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Selected */}
          <div className="rounded-lg border">
            <p className="px-2 pt-2.5 pb-1 text-[10px] uppercase font-medium text-muted-foreground tracking-wider">Selected ({selected.length})</p>
            <ScrollArea className="h-[198px]">
              <div className="p-1 space-y-0.5">
                {selected.map(lang => (
                  <div key={lang} className="flex items-center justify-between text-xs px-2 py-1.5 rounded hover:bg-accent transition-colors group">
                    <div className="flex items-center gap-1.5">
                      <Tooltip delayDuration={600}>
                        <TooltipTrigger asChild>
                          <button onClick={() => setDefaultLang(lang)}>
                            <Star className={`h-3 w-3 ${defaultLang === lang ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-muted-foreground"}`} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">{defaultLang === lang ? "Default language" : "Set as default"}</TooltipContent>
                      </Tooltip>
                      <span className={defaultLang === lang ? "font-semibold" : ""}>{lang}</span>
                    </div>
                    <button onClick={() => remove(lang)} className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {selected.length === 0 && <p className="text-xs text-muted-foreground p-3 text-center">No languages selected</p>}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Variant 5: Compact table with inline search ─── */
function Variant5() {
  const { selected, defaultLang, setDefaultLang, search, setSearch, filtered, add, remove } = useLanguageState();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Variant 5 — Compact Table</CardTitle>
        <CardDescription>A minimal table of selected languages with a floating search to add more.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {selected.length > 0 && (
          <div className="rounded-lg border overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto] text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-1.5 bg-muted/50 border-b">
              <span>Language</span>
              <span className="px-4">Default</span>
              <span className="w-8" />
            </div>
            {selected.map(lang => (
              <div key={lang} className="grid grid-cols-[1fr_auto_auto] items-center px-3 py-2 text-sm border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                <span className={defaultLang === lang ? "font-semibold" : ""}>{lang}</span>
                <div className="px-4 flex justify-center">
                  <Tooltip delayDuration={600}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setDefaultLang(lang)}
                        className="p-0.5 rounded transition-colors"
                      >
                        {defaultLang === lang ? (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/20 hover:border-primary transition-colors" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">{defaultLang === lang ? "Default language" : "Set as default"}</TooltipContent>
                  </Tooltip>
                </div>
                <button onClick={() => remove(lang)} className="w-8 flex justify-center text-muted-foreground hover:text-destructive transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {!showSearch ? (
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setShowSearch(true)}>
            <Plus className="h-3 w-3" /> Add language
          </Button>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search languages to add..."
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                autoFocus
                onBlur={() => setTimeout(() => { setShowSearch(false); setSearch(""); }, 200)}
              />
              <button onClick={() => { setShowSearch(false); setSearch(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {search && (
              <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                <ScrollArea className="max-h-40">
                  <div className="p-1 space-y-0.5">
                    {filtered.length === 0 ? <p className="text-xs text-muted-foreground p-2 text-center">No results</p> : filtered.slice(0, 15).map(lang => (
                      <button key={lang} onMouseDown={e => { e.preventDefault(); add(lang); }} className="w-full text-left text-sm px-2 py-1.5 rounded hover:bg-accent transition-colors">{lang}</button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LanguageSelectorDemo() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: "Brand Data Room", href: "/brand-data-room" }, { label: "Language Selector Demos" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ad Language Selector — UI Variants</h1>
        <p className="text-muted-foreground text-sm mt-1">Five distinct approaches to the same functionality. Pick your favorite.</p>
      </div>

      <div className="space-y-6">
        <Variant1 />
        <Variant2 />
        <Variant3 />
        <Variant4 />
        <Variant5 />
      </div>
    </div>
  );
}
