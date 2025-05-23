'use client'

import { ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"

export function BackButton() {
    return <Button variant="outline" onClick={() => history.back()}>
        <ArrowLeft />
    </Button>
}