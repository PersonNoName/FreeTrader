"use client";
import React from 'react';
import { CommandPalette } from '@/components/CommandPalette';
import SectorDetailModal from '@/components/SectorDetailModal';

export function GlobalClientComponents() {
    return (
        <>
            <CommandPalette />
            <SectorDetailModal />
        </>
    );
}
