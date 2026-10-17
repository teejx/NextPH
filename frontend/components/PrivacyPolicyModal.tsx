'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, Check, ChevronDown, ExternalLink, Lock, Database, Mail, UserCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset scroll and state when opened
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      // Small timeout to allow DOM to render before measuring
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // IntersectionObserver to detect when reader reaches bottom sentinel
  useEffect(() => {
    if (!isOpen) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasScrolledToBottom(true);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isOpen]);

  // Fallback scroll listener
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl rounded-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50/80 dark:bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-sm font-sans font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Privacy Policy & Reader Consent
              </h3>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block font-medium">
                Philippine Data Privacy Act of 2012 (RA 10173)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 p-1.5 rounded-xs transition-colors hidden sm:flex items-center gap-1"
              title="Open full policy in new tab"
            >
              <span>Full Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Policy Body */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          tabIndex={0}
          className="overflow-y-auto px-6 py-6 space-y-6 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed focus:outline-none"
        >
          {/* Notice Banner */}
          <div className="rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 p-4">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Please review our full editorial privacy policy below. To verify your informed consent, you must scroll to the bottom of this document before the &ldquo;Accept Policy&rdquo; button activates.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-base font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Database className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              1. Minimum Collection, Maximum Respect
            </h4>
            <p className="mt-2">
              WHAT&apos;S NEXT PH is designed around editorial integrity and digital dignity. We collect only the data voluntarily provided: your email address for weekly curated dispatches (<em>The Next Dispatch</em>), editorial inquiries, or tip submissions. We deliberately minimize all data capture.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-base font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Lock className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              2. Absolute Privacy Commitments
            </h4>
            <ul className="mt-2 list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>We never sell, rent, or trade reader data with data brokers or advertising networks.</li>
              <li>We do not utilize invasive cross-site tracking pixels or commercial surveillance scripts.</li>
              <li>Your subscription status is stored securely and never linked to external profiles.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-base font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              3. Newsletter Consent & Instant Unsubscribe
            </h4>
            <p className="mt-2">
              By subscribing, you give express consent to receive weekly editorial dispatches from our desk. Every email includes an immediate, one-click unsubscribe mechanism that completely removes your address from our distribution systems upon request.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-base font-black text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
              4. Your Rights Under Philippine Republic Act 10173
            </h4>
            <p className="mt-2">
              Under the Data Privacy Act of 2012, you possess statutory rights including the Right to be Informed, the Right to Access, the Right to Object, and the Right to Erasure or Blocking. You may contact our editorial desk anytime at <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">privacy@whatsnextph.local</span> to exercise these rights.
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-500">
            <p>
              Last updated: October 17, 2026. Published by WHAT&apos;S NEXT PH Media from Manila, Philippines.
            </p>
          </div>

          {/* Sentinel Element for Intersection Observer */}
          <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
        </div>

        {/* Footer with Scroll Detection and Action Buttons */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            {hasScrolledToBottom ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="h-4 w-4" />
                You have reached the end of the policy.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <ChevronDown className="h-4 w-4 animate-bounce text-zinc-950 dark:text-zinc-50" />
                Scroll down to the bottom to enable acceptance.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!hasScrolledToBottom}
              onClick={() => {
                onAccept();
                onClose();
              }}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                hasScrolledToBottom
                  ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm cursor-pointer'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-60'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Accept Policy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
