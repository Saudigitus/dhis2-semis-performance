import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    useLayoutEffect,
    type FocusEvent,
    type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import './SingleSelect.css';
import { CheckIcon, ChevronIcon, Error } from '../customIcons/customIcons';
import { SingleSelectProps } from 'src/types/fieldType';

export function SingleSelect({
    id,
    value = '',
    placeholder = '',
    options,
    filterable = true,
    filterPlaceholder = 'Type to filter options',
    disabled = false,
    dense = false,
    error = false,
    errorText,
    success,
    helperText,
    noMatchText = 'No options found',
    tabIndex = 0,
    handleChange,
    handleBlur,
}: SingleSelectProps) {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    /* ── Refs ── */
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const portalTargetRef = useRef<HTMLElement | null>(null);

    /* ── Capture ownerDocument.body once mounted ── */
    useEffect(() => {
        portalTargetRef.current =
            containerRef.current?.ownerDocument?.body ?? null;
    }, []);

    /* ── Filtered options ── */
    const filtered = useMemo(() => {
        if (!filter) return options;
        const lower = filter.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(lower));
    }, [options, filter]);

    /* ── Selected label ── */
    const selectedLabel = useMemo(
        () => options.find((o) => o.value === value)?.label ?? '',
        [options, value],
    );

    /* ── Calculate menu position ── */
    const updateMenuPosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuStyle({
            position: 'fixed',
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 9999,
        });
    }, []);

    /* ── Open / Close helpers ── */
    const openMenu = useCallback(() => {
        if (disabled) return;
        setOpen(true);
        setFilter('');
        setHighlightedIndex(-1);
    }, [disabled]);

    const closeMenu = useCallback(() => {
        setOpen(false);
        setFilter('');
        setHighlightedIndex(-1);
    }, []);

    /* ── Select an option ── */
    const selectOption = (optionValue: string) => {
        handleChange?.(optionValue);
        triggerRef.current?.focus();
    };

    /* ── Focus management for handleBlur ── */
    const handleContainerBlur = useCallback(
        (_e: FocusEvent<HTMLDivElement>) => {
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);

            blurTimeoutRef.current = setTimeout(() => {
                const ownerDoc = containerRef.current?.ownerDocument;
                const activeEl = ownerDoc?.activeElement ?? null;
                const inContainer =
                    containerRef.current?.contains(activeEl) ?? false;
                const inMenu =
                    menuRef.current?.contains(activeEl) ?? false;

                if (!inContainer && !inMenu) {
                    handleBlur?.();
                }
            }, 0);
        },
        [handleBlur],
    );

    /* ── Portal menu blur / focus ── */
    const handleMenuBlur = useCallback(
        (_e: FocusEvent<HTMLDivElement>) => {
            if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);

            blurTimeoutRef.current = setTimeout(() => {
                const ownerDoc = containerRef.current?.ownerDocument;
                const activeEl = ownerDoc?.activeElement ?? null;
                const inContainer =
                    containerRef.current?.contains(activeEl) ?? false;
                const inMenu =
                    menuRef.current?.contains(activeEl) ?? false;

                if (!inContainer && !inMenu) {
                    closeMenu();
                    handleBlur?.();
                }
            }, 0);
        },
        [closeMenu, handleBlur],
    );

    const handleMenuFocus = useCallback(() => {
        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    }, []);

    /* ── Click outside ── */
    useEffect(() => {
        if (!open) return;

        const ownerDoc = containerRef.current?.ownerDocument;
        if (!ownerDoc) return;

        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            const inContainer =
                containerRef.current?.contains(target) ?? false;
            const inMenu = menuRef.current?.contains(target) ?? false;

            if (!inContainer && !inMenu) {
                closeMenu();
            }
        };

        ownerDoc.addEventListener('mousedown', handler);
        return () => ownerDoc.removeEventListener('mousedown', handler);
    }, [open, closeMenu]);

    /* ── Position menu on open ── */
    useLayoutEffect(() => {
        if (!open) return;
        updateMenuPosition();
    }, [open, updateMenuPosition]);

    /* ── Reposition on scroll / resize ── */
    useEffect(() => {
        if (!open) return;

        const ownerWin =
            containerRef.current?.ownerDocument?.defaultView;
        if (!ownerWin) return;

        const reposition = () => updateMenuPosition();
        ownerWin.addEventListener('scroll', reposition, true);
        ownerWin.addEventListener('resize', reposition);
        return () => {
            ownerWin.removeEventListener('scroll', reposition, true);
            ownerWin.removeEventListener('resize', reposition);
        };
    }, [open, updateMenuPosition]);

    /* ── Focus search on open ── */
    useEffect(() => {
        if (open && filterable) {
            requestAnimationFrame(() => searchRef.current?.focus());
        }
    }, [open, filterable]);

    /* ── Scroll highlighted option into view ── */
    useEffect(() => {
        if (highlightedIndex < 0 || !optionsRef.current) return;
        const items = optionsRef.current.querySelectorAll(
            '.dhis2-single-select__option',
        );
        items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
    }, [highlightedIndex]);

    /* ── Keyboard navigation ── */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (disabled) return;

            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    if (!open) {
                        openMenu();
                        return;
                    }
                    setHighlightedIndex((prev) => {
                        let next = prev + 1;
                        while (
                            next < filtered.length &&
                            filtered[next].disabled
                        )
                            next++;
                        return next < filtered.length ? next : prev;
                    });
                    break;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    if (!open) {
                        openMenu();
                        return;
                    }
                    setHighlightedIndex((prev) => {
                        let next = prev - 1;
                        while (next >= 0 && filtered[next].disabled) next--;
                        return next >= 0 ? next : prev;
                    });
                    break;
                }
                case 'Enter':
                case ' ': {
                    if (!open) {
                        e.preventDefault();
                        openMenu();
                    } else if (
                        highlightedIndex >= 0 &&
                        filtered[highlightedIndex]
                    ) {
                        e.preventDefault();
                        if (!filtered[highlightedIndex].disabled) {
                            selectOption(filtered[highlightedIndex].value);
                        }
                    }
                    break;
                }
                case 'Escape': {
                    e.preventDefault();
                    closeMenu();
                    triggerRef.current?.focus();
                    break;
                }
                case 'Tab': {
                    if (open) closeMenu();
                    break;
                }
                case 'Home': {
                    if (open) {
                        e.preventDefault();
                        setHighlightedIndex(0);
                    }
                    break;
                }
                case 'End': {
                    if (open) {
                        e.preventDefault();
                        setHighlightedIndex(filtered.length - 1);
                    }
                    break;
                }
                default:
                    break;
            }
        },
        [
            disabled,
            open,
            openMenu,
            closeMenu,
            filtered,
            highlightedIndex,
            selectOption,
        ],
    );

    /* ── Build class names ── */
    const rootCls = [
        'dhis2-single-select',
        dense && 'dhis2-single-select--dense',
    ]
        .filter(Boolean)
        .join(' ');

    const triggerCls = [
        'dhis2-single-select__trigger',
        open && 'dhis2-single-select__trigger--open',
        error && 'dhis2-single-select__trigger--error',
        success && 'dhis2-single-select__trigger--success',
        disabled && 'dhis2-single-select__trigger--disabled',
    ]
        .filter(Boolean)
        .join(' ');

    /* ── Dropdown menu rendered via Portal ── */
    const portalTarget = portalTargetRef.current;

    const dropdownMenu =
        open && portalTarget
            ? createPortal(
                  <div
                      ref={menuRef}
                      className={`dhis2-single-select__menu${dense ? ' dhis2-single-select__menu--dense' : ''}`}
                      style={menuStyle}
                      role="presentation"
                      onBlur={handleMenuBlur}
                      onFocus={handleMenuFocus}
                      onKeyDown={handleKeyDown}
                  >
                      {filterable && (
                          <div className="dhis2-single-select__search">
                              <input
                                  ref={searchRef}
                                  type="text"
                                  className="dhis2-single-select__search-input"
                                  placeholder={filterPlaceholder}
                                  value={filter}
                                  onChange={(e) => {
                                      setFilter(e.target.value);
                                      setHighlightedIndex(-1);
                                  }}
                                  autoComplete="off"
                              />
                          </div>
                      )}

                      <ul
                          ref={optionsRef}
                          className="dhis2-single-select__options"
                          role="listbox"
                      >
                          {filtered.length === 0 ? (
                              <li className="dhis2-single-select__empty">
                                  {noMatchText}
                              </li>
                          ) : (
                              filtered.map((option, index) => {
                                  const isSelected = option.value === value;
                                  const isHighlighted =
                                      index === highlightedIndex;
                                  const optCls = [
                                      'dhis2-single-select__option',
                                      isSelected &&
                                          'dhis2-single-select__option--selected',
                                      isHighlighted &&
                                          'dhis2-single-select__option--highlighted',
                                      option.disabled &&
                                          'dhis2-single-select__option--disabled',
                                  ]
                                      .filter(Boolean)
                                      .join(' ');

                                  return (
                                      <li
                                          key={option.value}
                                          className={optCls}
                                          role="option"
                                          aria-selected={isSelected}
                                          onMouseEnter={() =>
                                              setHighlightedIndex(index)
                                          }
                                          onMouseLeave={() =>
                                              setHighlightedIndex(-1)
                                          }
                                          onClick={() => {
                                              selectOption(option.value);
                                          }}
                                      >
                                          <CheckIcon visible={isSelected} />
                                          {option.label}
                                      </li>
                                  );
                              })
                          )}
                      </ul>
                  </div>,
                  portalTarget,
              )
            : null;

    /* ── Render ── */
    return (
        <div
            ref={containerRef}
            className={rootCls}
            id={id}
            onBlur={handleContainerBlur}
            onKeyDown={handleKeyDown}
        >
            <button
                ref={triggerRef}
                type="button"
                className={triggerCls}
                tabIndex={tabIndex}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => (open ? closeMenu() : openMenu())}
            >
                <span
                    className={`dhis2-single-select__trigger-content${!value ? ' dhis2-single-select__placeholder' : ''}`}
                >
                    {value ? selectedLabel : placeholder}
                </span>

                {error && <Error />}
                <span className="dhis2-single-select__actions">
                    <ChevronIcon open={open} />
                </span>
            </button>

            {dropdownMenu}

            {error && errorText && (
                <p className="dhis2-single-select__error-text">{errorText}</p>
            )}
            {!error && helperText && (
                <p className="dhis2-single-select__helper">{helperText}</p>
            )}
        </div>
    );
}