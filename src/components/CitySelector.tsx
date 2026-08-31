import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { projects } from "@/data/projects";
import { allRegions, regionGroups, type Region, type RegionGroup } from "@/data/regions";
import { sortGeoItems } from "@/lib/geoOrder";
import {
  ALL_REGIONS_GEO_LABEL,
  ALL_REGIONS_GEO_SLUG,
  DEFAULT_GEO_SLUG,
  isAllRegionsGeo,
  isProjectAvailableInGeo,
  normalizeGeoSelection,
  resolveGeoSelection,
} from "@/lib/geoSelection";
import { pluralizeRu } from "@/lib/utils";

const CITY_STORAGE_KEY = "selected_city";
const CITY_AUTO_DETECTED_KEY = "city_auto_detected";
const GEO_SELECTION_VERSION_KEY = "geo_selection_version";
const CURRENT_GEO_SELECTION_VERSION = "2";
const EXPLICIT_ALL_REGIONS_STATUS = "all-regions";

const CITY_EVENT = "city-changed";

const readStoredSelection = () => {
  try {
    if (localStorage.getItem(GEO_SELECTION_VERSION_KEY) !== CURRENT_GEO_SELECTION_VERSION) {
      localStorage.setItem(CITY_STORAGE_KEY, DEFAULT_GEO_SLUG);
      localStorage.removeItem(CITY_AUTO_DETECTED_KEY);
      localStorage.setItem(GEO_SELECTION_VERSION_KEY, CURRENT_GEO_SELECTION_VERSION);
      return { city: DEFAULT_GEO_SLUG, hasExplicitSelection: false };
    }

    const stored = localStorage.getItem(CITY_STORAGE_KEY);
    const selectionStatus = localStorage.getItem(CITY_AUTO_DETECTED_KEY);
    const wasChosenByUser = selectionStatus === "manual"
      || selectionStatus === "confirmed"
      || selectionStatus === EXPLICIT_ALL_REGIONS_STATUS;
    const normalized = wasChosenByUser ? normalizeGeoSelection(stored) : DEFAULT_GEO_SLUG;
    if (stored !== normalized) localStorage.setItem(CITY_STORAGE_KEY, normalized);
    return {
      city: normalized,
      hasExplicitSelection: selectionStatus === EXPLICIT_ALL_REGIONS_STATUS
        || (!isAllRegionsGeo(normalized) && wasChosenByUser),
    };
  } catch {
    return { city: DEFAULT_GEO_SLUG, hasExplicitSelection: false };
  }
};

const broadcastCity = (c: string) => {
  try { localStorage.setItem(CITY_STORAGE_KEY, c); } catch { /* localStorage может быть недоступен */ }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CITY_EVENT, { detail: c }));
  }
};

export function useCity() {
  const [selection, setSelection] = useState(readStoredSelection);

  // Подписка на изменения города из других компонентов / вкладок
  useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setSelection(readStoredSelection());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === CITY_STORAGE_KEY && e.newValue) setSelection(readStoredSelection());
    };
    window.addEventListener(CITY_EVENT, onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CITY_EVENT, onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const selectCity = useCallback((c: string) => {
    const normalized = normalizeGeoSelection(c);
    try {
      localStorage.setItem(GEO_SELECTION_VERSION_KEY, CURRENT_GEO_SELECTION_VERSION);
      localStorage.setItem(
        CITY_AUTO_DETECTED_KEY,
        isAllRegionsGeo(normalized) ? EXPLICIT_ALL_REGIONS_STATUS : "manual",
      );
    } catch { /* localStorage может быть недоступен */ }
    setSelection({ city: normalized, hasExplicitSelection: true });
    broadcastCity(normalized);
  }, []);

  return { city: selection.city, selectCity, hasExplicitSelection: selection.hasExplicitSelection };
}

interface CitySelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: string;
  onSelect: (city: string) => void;
  title?: string;
  availableRegions?: Region[];
  hasExplicitSelection?: boolean;
}

type RegionGroupOption = RegionGroup & { projectsCount: number };

const getRegionGroupProjectCount = (group: RegionGroup) => {
  return projects.filter((project) => (
    isProjectAvailableInGeo(project.city, group.region.slug, project.deliveryRegionSlugs)
    && (!group.region.technologyValue || project.technology === group.region.technologyValue)
  )).length;
};

const formatProjectsCount = (count: number) =>
  `${count} ${pluralizeRu(count, "проект", "проекта", "проектов")}`;

const CitySelector = ({
  open,
  onOpenChange,
  city,
  onSelect,
  title = "Ваш регион",
  availableRegions = allRegions,
  hasExplicitSelection = true,
}: CitySelectorProps) => {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const cityListRef = useRef<HTMLDivElement>(null);
  const isGlobalSelector = availableRegions === allRegions;
  const normalizedSearch = search.trim().toLocaleLowerCase("ru");
  const showAllRegionsOption = isGlobalSelector
    && (!normalizedSearch || ALL_REGIONS_GEO_LABEL.toLocaleLowerCase("ru").includes(normalizedSearch));

  const groupOptions = useMemo<RegionGroupOption[]>(() => sortGeoItems(
    regionGroups
      .map((group) => ({ ...group, projectsCount: getRegionGroupProjectCount(group) }))
      .filter((group) => group.projectsCount > 0),
    (group) => group.region.cityValue,
    (a, b) => b.projectsCount - a.projectsCount || a.label.localeCompare(b.label, "ru"),
  ), []);

  const projectCountByGroupSlug = useMemo(
    () => new Map(groupOptions.map((group) => [group.slug, group.projectsCount])),
    [groupOptions],
  );

  useEffect(() => {
    if (!open) return;

    setSearch("");
    const selectedRegion = resolveGeoSelection(city);
    const selectedGroupSlug = selectedRegion?.baseRegionSlug ?? selectedRegion?.slug;
    setExpandedGroups(selectedGroupSlug ? new Set([selectedGroupSlug]) : new Set());
  }, [city, open]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const cityList = cityListRef.current;
    if (!panel || !cityList) return;

    const routeWheelToCityList = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      cityList.scrollTop += event.deltaY;
    };

    panel.addEventListener("wheel", routeWheelToCityList, { passive: false });
    return () => panel.removeEventListener("wheel", routeWheelToCityList);
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return sortGeoItems(availableRegions, (region) => region.name);
    const q = search.toLocaleLowerCase("ru");
    return sortGeoItems(
      availableRegions.filter((region) => {
        const baseRegion = region.baseRegionSlug ? resolveGeoSelection(region.baseRegionSlug) : undefined;
        return [region.name, region.catalogRegionLabel, baseRegion?.name, ...(region.searchAliases ?? [])]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase("ru").includes(q));
      }),
      (region) => region.name,
    );
  }, [availableRegions, search]);

  const globalSearchOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");
    if (!query || !isGlobalSelector) return [];

    return groupOptions.flatMap((group) => {
      const area = group.cities.find((region) => region.deliveryArea);
      const groupMatches = [
        group.label,
        group.region.name,
        group.region.catalogRegionLabel,
        ...(group.region.searchAliases ?? []),
        area?.name,
        area?.catalogRegionLabel,
        ...(area?.searchAliases ?? []),
      ]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLocaleLowerCase("ru").includes(query));

      const matchingCities = group.cities.filter((region) => (
        region.deliveryCity
        && [region.name, region.catalogRegionLabel, ...(region.searchAliases ?? [])]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase("ru").includes(query))
      ));

      return [
        ...(groupMatches ? [{ region: group.region, label: group.label, projectsCount: group.projectsCount, deliveryCity: false }] : []),
        ...matchingCities.map((region) => ({
          region,
          label: region.name,
          projectsCount: group.projectsCount,
          deliveryCity: true,
        })),
      ];
    });
  }, [groupOptions, isGlobalSelector, search]);

  const getProjectCountForRegion = (region: Region) => {
    const groupSlug = region.baseRegionSlug ?? region.slug;
    return projectCountByGroupSlug.get(groupSlug) ?? 0;
  };

  const toggleGroup = (groupSlug: string) => {
    setExpandedGroups((current) => (
      current.has(groupSlug) ? new Set() : new Set([groupSlug])
    ));
  };

  const handleSelect = (slug: string) => {
    onSelect(slug);
    onOpenChange(false);
  };

  const allRegionsOption = showAllRegionsOption ? (
    <button
      type="button"
      onClick={() => handleSelect(ALL_REGIONS_GEO_SLUG)}
      aria-current={hasExplicitSelection && city === ALL_REGIONS_GEO_SLUG ? "true" : undefined}
      className={`my-0.5 flex min-h-[60px] w-full cursor-pointer items-center rounded-[var(--radius)] px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
        hasExplicitSelection && city === ALL_REGIONS_GEO_SLUG
          ? "bg-[#f2f3f7] text-primary"
          : "text-[#342d27] hover:bg-[#f2f3f7] hover:text-primary"
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-tight md:text-[16px]">{ALL_REGIONS_GEO_LABEL}</span>
        <span className={`mt-1 block text-[12px] font-normal leading-tight ${hasExplicitSelection && city === ALL_REGIONS_GEO_SLUG ? "text-primary/70" : "text-[#667085]"}`}>
          {formatProjectsCount(projects.length)}
        </span>
      </span>
    </button>
  ) : null;

  const content = (
    <div
      ref={panelRef}
      className={`flex flex-col bg-white ${isMobile ? "h-[78dvh] max-h-[78dvh]" : "h-[78vh] max-h-[680px]"}`}
    >
      <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-5 md:px-6 md:pb-5 md:pt-6">
        <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[#342d27] md:text-[22px]">{title}</h2>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-transparent text-[#667085] transition-colors hover:border-[#dfe5f5] hover:bg-[#f8faff] hover:text-[#342d27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Закрыть выбор города"
        >
          <X className="h-[18px] w-[18px]" strokeWidth={1.6} />
        </button>
      </div>
      <div className="shrink-0 px-5 pb-5 md:px-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" strokeWidth={1.6} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск города"
            className="h-12 w-full rounded-[var(--radius)] border border-[#dfe5f5] bg-[#f8faff] pl-11 pr-4 text-[16px] text-[#342d27] placeholder:text-[#7e879a] focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 md:text-[14px]"
          />
        </div>
      </div>
      <div ref={cityListRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 md:px-6">
        {search.trim() && isGlobalSelector && globalSearchOptions.length === 0 && !showAllRegionsOption ? (
          <p className="py-10 text-center text-[14px] text-[#667085]">Город не найден</p>
        ) : search.trim() && isGlobalSelector ? (
          <>
            {allRegionsOption}
            {globalSearchOptions.map(({ region, label, projectsCount, deliveryCity }) => (
              <button
                key={region.slug}
                type="button"
                onClick={() => handleSelect(region.slug)}
                aria-current={region.slug === city ? "true" : undefined}
                className={`my-0.5 flex min-h-[60px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  region.slug === city
                    ? "bg-[#f2f3f7] text-primary"
                    : "text-[#342d27] hover:bg-[#f2f3f7] hover:text-primary"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium leading-tight md:text-[16px]">{label}</span>
                  <span className={`mt-1 block text-[12px] font-normal leading-tight ${region.slug === city ? "text-primary/70" : "text-[#667085]"}`}>
                    {formatProjectsCount(projectsCount)}{deliveryCity ? " с доставкой" : ""}
                  </span>
                </span>
              </button>
            ))}
          </>
        ) : isGlobalSelector ? (
          <div className="space-y-1">
            {allRegionsOption}
            {groupOptions.map((group) => {
              const isExpanded = expandedGroups.has(group.slug);
              const isGroupSelected = group.region.slug === city;
              const deliveryCities = group.cities.filter((region) => region.deliveryCity);
              const panelId = `city-selector-group-${group.slug}`;

              return (
                <section key={group.slug} aria-labelledby={`${panelId}-title`}>
                  <div className={`flex min-h-[64px] items-stretch rounded-[var(--radius)] transition-colors duration-150 ${isGroupSelected ? "bg-[#f2f3f7]" : "hover:bg-[#f8faff]"}`}>
                    <button
                      id={`${panelId}-title`}
                      type="button"
                      onClick={() => handleSelect(group.region.slug)}
                      aria-current={isGroupSelected ? "true" : undefined}
                      className={`min-w-0 flex-1 cursor-pointer rounded-l-[var(--radius)] px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 ${isGroupSelected ? "text-primary" : "text-[#342d27] hover:text-primary"}`}
                    >
                      <span className="block text-[15px] font-medium leading-tight md:text-[16px]">{group.label}</span>
                      <span className={`mt-1 block text-[12px] font-normal leading-tight ${isGroupSelected ? "text-primary/70" : "text-[#667085]"}`}>
                        {formatProjectsCount(group.projectsCount)}
                      </span>
                    </button>
                    {deliveryCities.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.slug)}
                        aria-label={`${isExpanded ? "Скрыть" : "Показать"} города доставки: ${group.label}`}
                        aria-expanded={isExpanded}
                        aria-controls={panelId}
                        className="flex min-h-11 w-12 shrink-0 cursor-pointer items-center justify-center rounded-r-[var(--radius)] text-[#667085] transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30"
                      >
                        <ChevronDown className={`h-[18px] w-[18px] transition-transform duration-200 motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`} strokeWidth={1.7} aria-hidden />
                      </button>
                    )}
                  </div>

                  {isExpanded && deliveryCities.length > 0 && (
                    <div id={panelId} className="mb-2 ml-4 pl-3 pt-1">
                      {deliveryCities.map((region) => {
                        const isSelected = region.slug === city;

                        return (
                          <button
                            key={region.slug}
                            type="button"
                            onClick={() => handleSelect(region.slug)}
                            aria-current={isSelected ? "true" : undefined}
                            className={`my-0.5 flex min-h-[56px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                              isSelected
                                ? "bg-[#f2f3f7] text-primary"
                                : "text-[#342d27] hover:bg-[#f2f3f7] hover:text-primary"
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-[15px] font-medium leading-tight">{region.name}</span>
                              <span className={`mt-1 block text-[12px] font-normal leading-tight ${isSelected ? "text-primary/70" : "text-[#667085]"}`}>
                                {formatProjectsCount(group.projectsCount)} с доставкой
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#667085]">Город не найден</p>
        ) : (
          filtered.map((region) => (
            <button
              key={region.slug}
              type="button"
              onClick={() => handleSelect(region.slug)}
              aria-current={region.slug === city ? "true" : undefined}
              className={`my-0.5 flex min-h-[60px] w-full cursor-pointer items-center gap-3 rounded-[var(--radius)] px-4 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                region.slug === city
                  ? "bg-[#f2f3f7] text-primary"
                  : "text-[#342d27] hover:bg-[#f2f3f7] hover:text-primary"
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-tight md:text-[16px]">{region.name}</span>
                <span className={`mt-1 block text-[12px] font-normal leading-tight ${region.slug === city ? "text-primary/70" : "text-[#667085]"}`}>
                  {formatProjectsCount(getProjectCountForRegion(region))}{region.deliveryCity || region.deliveryArea ? " с доставкой" : ""}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="mx-0 h-[82dvh] max-h-[82dvh] rounded-t-[var(--radius)] border-[#dfe5f5] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-[#17213b]/35 backdrop-blur-[1px]" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-[70] max-h-[78vh] w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--radius)] border border-[#dfe5f5] bg-white shadow-[0_28px_80px_rgba(28,38,66,0.22)]">
        {content}
      </div>
    </>
  );
};

export default CitySelector;
