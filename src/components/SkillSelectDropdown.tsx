import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Check,
  X,
  ChevronDown,
  Tag,
  AlertCircle,
  Plus,
  Layers,
  BookOpen
} from 'lucide-react';
import {
  VALID_SKILL_CATEGORIES,
  ALL_VALID_SKILLS,
  searchSkills,
  isValidSkill
} from '../data/skillsAndRolesCatalog';

interface SkillSelectDropdownProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  allowQuickAddCategories?: boolean;
}

export const SkillSelectDropdown: React.FC<SkillSelectDropdownProps> = ({
  selectedSkills,
  onChange,
  maxSkills = 15,
  label = 'Candidate Technical & Professional Skills',
  placeholder = 'Search & select verified skill from dropdown...',
  helperText = 'Select from over 150+ verified skills across technical and industry categories.',
  required = false,
  allowQuickAddCategories = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(VALID_SKILL_CATEGORIES[0].categoryName);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSearchResults = searchTerm.trim()
    ? searchSkills(searchTerm, 18)
    : [];

  const handleToggleSkill = (skill: string) => {
    setValidationWarning(null);
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill));
    } else {
      if (selectedSkills.length >= maxSkills) {
        setValidationWarning(`Maximum limit of ${maxSkills} skills reached.`);
        return;
      }
      if (!isValidSkill(skill)) {
        setValidationWarning(`"${skill}" is not a recognized technical or professional skill. Please choose a valid skill from the dropdown.`);
        return;
      }
      onChange([...selectedSkills, skill]);
      setSearchTerm('');
    }
  };

  const handleRemoveSkill = (skill: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange(selectedSkills.filter((s) => s !== skill));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const currentCategoryObj = VALID_SKILL_CATEGORIES.find(
    (c) => c.categoryName === activeCategory
  ) || VALID_SKILL_CATEGORIES[0];

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {/* Label and Count */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-500" />
          <span>{label}</span>
          {required && <span className="text-amber-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {selectedSkills.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
            >
              Clear All ({selectedSkills.length})
            </button>
          )}
          <span className="text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
            {selectedSkills.length} / {maxSkills} Selected
          </span>
        </div>
      </div>

      {/* Selected Skill Tags Display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[42px] items-center">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-2xs group"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={(e) => handleRemoveSkill(skill, e)}
                className="text-amber-700 hover:text-amber-950 dark:text-amber-300 hover:bg-amber-200/60 dark:hover:bg-amber-900 rounded-md p-0.5 cursor-pointer transition"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Toggle / Search Trigger Box */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }
          }}
          className={`w-full bg-slate-50 dark:bg-slate-800 border ${
            isOpen
              ? 'border-indigo-500 ring-2 ring-indigo-500/20'
              : 'border-slate-300 dark:border-slate-700'
          } rounded-xl px-4 py-2.5 text-xs text-left font-medium text-slate-800 dark:text-white flex items-center justify-between gap-2 cursor-pointer transition shadow-2xs`}
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className={selectedSkills.length === 0 ? 'text-slate-400 font-normal' : 'font-semibold text-slate-800 dark:text-white'}>
              {selectedSkills.length === 0 ? placeholder : `${selectedSkills.length} skills selected — Click to add or browse catalog`}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </button>

        {/* Warning Banner */}
        {validationWarning && (
          <div className="mt-1.5 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationWarning}</span>
          </div>
        )}

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 max-h-[420px] flex flex-col">
            {/* Search Input inside Dropdown */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setValidationWarning(null);
                }}
                placeholder="Type to filter skills (e.g., Python, React, SQL, Cloud)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* If Search Term Active: Display Matched Search Results */}
            {searchTerm.trim() ? (
              <div className="overflow-y-auto flex-1 space-y-1.5 pr-1 max-h-64">
                <span className="text-[10px] uppercase font-bold text-slate-400 px-1 block">
                  Search Results ({filteredSearchResults.length} matches)
                </span>
                {filteredSearchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      No verified skill matched "{searchTerm}"
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Only verified skills from our 150+ categorized catalog are supported.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredSearchResults.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 font-extrabold'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{skill}</span>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Category Browsing Tabs */
              <div className="flex flex-col sm:flex-row gap-3 flex-1 overflow-hidden">
                {/* Category Sidebar List */}
                <div className="w-full sm:w-1/3 overflow-y-auto space-y-1 pr-1 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 max-h-48 sm:max-h-64 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 block mb-1">
                    Industry Sectors
                  </span>
                  {VALID_SKILL_CATEGORIES.map((cat) => {
                    const isActive = cat.categoryName === activeCategory;
                    const selectedCountInCat = cat.skills.filter((s) =>
                      selectedSkills.includes(s)
                    ).length;

                    return (
                      <button
                        key={cat.categoryName}
                        type="button"
                        onClick={() => setActiveCategory(cat.categoryName)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-between gap-1 cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate text-[11px]">{cat.categoryName ? cat.categoryName.split('&')[0] : 'Category'}</span>
                        {selectedCountInCat > 0 && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                              isActive
                                ? 'bg-indigo-800 text-white'
                                : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {selectedCountInCat}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Skills Grid for Selected Category */}
                <div className="flex-1 overflow-y-auto max-h-48 sm:max-h-64 space-y-2 pr-1">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{currentCategoryObj.categoryName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {currentCategoryObj.skills.length} verified skills
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentCategoryObj.skills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition text-left cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-100/90 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 font-extrabold shadow-2xs'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{skill}</span>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Dropdown Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedSkills.length} of {maxSkills} skills picked
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-xs"
              >
                Done Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
        <span>{helperText}</span>
      </p>
    </div>
  );
};
