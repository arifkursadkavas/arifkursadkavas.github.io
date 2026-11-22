import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import { FacetOption, suggest } from '../lib/movies';

interface Props {
  // null until suggestions are prepared
  options: FacetOption[] | null;
  optionsAvailable?: boolean;
  selected: string[];
  label: string;
  placeholder?: string;
  onFocus?: () => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}

function Highlight({ option, query }: { option: FacetOption; query: string }) {
  const q = query.trim().toLowerCase();
  // the match position can only be trusted when lower-casing did not change the length
  const at = q && option.lower.length === option.value.length ? option.lower.indexOf(q) : -1;
  if (at < 0) return <>{option.value}</>;
  return (
    <>
      {option.value.slice(0, at)}
      <mark>{option.value.slice(at, at + q.length)}</mark>
      {option.value.slice(at + q.length)}
    </>
  );
}

export default function ValuePicker({
  options,
  optionsAvailable = options !== null,
  selected,
  label,
  placeholder,
  onFocus = () => {},
  onAdd,
  onRemove,
}: Props) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(
    () => (options ? suggest(options, query, selected) : []),
    [options, query, selected]
  );
  const showList = open && matches.length > 0;
  const showEmpty = open && options != null && matches.length === 0 && query.trim() !== '';
  const activeIndex = showList ? Math.min(active, matches.length - 1) : -1;
  const inputPlaceholder = !optionsAvailable
    ? `Loading ${label.toLowerCase()}…`
    : placeholder ?? `Search ${label.toLowerCase()}…`;

  useEffect(() => {
    // keeps the highlighted option visible while moving through a long list
    (listRef.current?.children[activeIndex] as HTMLElement | undefined)?.scrollIntoView?.({
      block: 'nearest',
    });
  }, [activeIndex]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const add = (value: string) => {
    onAdd(value);
    setQuery('');
    setActive(-1);
  };

  // wraps around at both ends; from "nothing highlighted" down goes to the first, up to the last
  const move = (step: 1 | -1) => {
    const n = matches.length;
    if (n === 0) return;
    setOpen(true);
    setActive(step === 1 ? (activeIndex + 1) % n : activeIndex <= 0 ? n - 1 : activeIndex - 1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        move(-1);
        break;
      case 'Enter':
        if (activeIndex >= 0) {
          e.preventDefault();
          add(matches[activeIndex].value);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        } else if (query) {
          setQuery('');
        }
        break;
      case 'Backspace':
        if (!query && selected.length > 0) onRemove(selected[selected.length - 1]);
        break;
    }
  };

  const listId = `${id}-list`;

  return (
    <div className='valuePicker'>
      <div
        className={`valueField${optionsAvailable ? '' : ' isLoading'}`}
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((value) => (
          <span className='valueChip' key={value}>
            <span className='valueChipText' title={value}>
              {value}
            </span>
            <button type='button' aria-label={`Remove ${value}`} onClick={() => onRemove(value)}>
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className='valueInput'
          type='text'
          role='combobox'
          autoComplete='off'
          aria-label={`Add ${label.toLowerCase()}`}
          aria-autocomplete='list'
          aria-expanded={showList}
          aria-controls={showList ? listId : undefined}
          aria-activedescendant={activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          value={query}
          disabled={!optionsAvailable}
          placeholder={inputPlaceholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            // typing highlights the best match so Enter adds it
            setActive(e.target.value.trim() ? 0 : -1);
          }}
          onFocus={() => {
            setOpen(true);
            onFocus();
          }}
          onBlur={close}
          onKeyDown={onKeyDown}
        />
      </div>

      {(showList || showEmpty) && (
        <div className='valueDropdown'>
          {showList ? (
            <div className='valueList' role='listbox' id={listId} aria-label={label} ref={listRef}>
              {matches.map((option, index) => (
                <div
                  key={option.value}
                  id={`${id}-option-${index}`}
                  role='option'
                  aria-selected={index === activeIndex}
                  className={`valueOption${index === activeIndex ? ' isActive' : ''}`}
                  // keeps focus in the input so the list does not close before the click lands
                  onMouseDown={(e) => e.preventDefault()}
                  // movement is checked because browsers fire a fake mousemove after the list scrolls
                  onMouseMove={(e) => (e.movementX || e.movementY) && setActive(index)}
                  onClick={() => add(option.value)}
                >
                  <span className='valueOptionText' title={option.value}>
                    <Highlight option={option} query={query} />
                  </span>
                  <span className='valueCount'>{option.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='valueEmpty'>No matches</div>
          )}
          {showList && (
            <div className='valueHint' aria-hidden='true'>
              ↑↓ navigate · Enter add · Esc close
            </div>
          )}
        </div>
      )}
    </div>
  );
}
