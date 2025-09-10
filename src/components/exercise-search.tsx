
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { exerciseList } from "@/lib/exercises"
import Image from "next/image"

interface ExerciseSearchProps {
    value: string;
    onSelect: (value: string) => void;
}

export function ExerciseSearch({ value, onSelect }: ExerciseSearchProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar exercício..." />
          <CommandList>
            <CommandEmpty>Nenhum exercício encontrado.</CommandEmpty>
            <CommandGroup>
              {exerciseList.map((exercise) => (
                <CommandItem
                  key={exercise.value}
                  value={exercise.label}
                  onSelect={(currentValue) => {
                    const selectedLabel = exerciseList.find(e => e.label.toLowerCase() === currentValue.toLowerCase())?.label || ""
                    onSelect(selectedLabel)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <Image src={exercise.imageUrl} alt={exercise.label} width={40} height={40} className="rounded-sm" data-ai-hint={exercise.aiHint}/>
                  <span className="flex-1">{exercise.label}</span>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === exercise.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
