"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const PROVINCES = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
];

const EMPLOYMENT_STATUSES = [
    "FULL_TIME", "PART_TIME", "SELF_EMPLOYED", "UNEMPLOYED", "RETIRED"
];

export function LeadsFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Local state for immediate feedback
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "ALL");
    const [loanType, setLoanType] = useState(searchParams.get("loanType") || "ALL");

    // New Filters
    const [provinces, setProvinces] = useState<string[]>(searchParams.get("provinces")?.split(",").filter(Boolean) || []);
    const [employment, setEmployment] = useState(searchParams.get("employment") || "ALL");
    const [ownsVehicle, setOwnsVehicle] = useState(searchParams.get("vehicle") === "true");
    const [ownsHome, setOwnsHome] = useState(searchParams.get("home") === "true");

    const [startDate, setStartDate] = useState(searchParams.get("from") || "");
    const [endDate, setEndDate] = useState(searchParams.get("to") || "");

    // Sync state with URL params
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setStatus(searchParams.get("status") || "ALL");
        setLoanType(searchParams.get("loanType") || "ALL");
        setProvinces(searchParams.get("provinces")?.split(",").filter(Boolean) || []);
        setEmployment(searchParams.get("employment") || "ALL");
        setOwnsVehicle(searchParams.get("vehicle") === "true");
        setOwnsHome(searchParams.get("home") === "true");
        setStartDate(searchParams.get("from") || "");
        setEndDate(searchParams.get("to") || "");
    }, [searchParams]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "ALL") {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        return params.toString();
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (search) params.set("search", search);
        else params.delete("search");

        if (status && status !== "ALL") params.set("status", status);
        else params.delete("status");

        if (loanType && loanType !== "ALL") params.set("loanType", loanType);
        else params.delete("loanType");

        // New Filters
        if (provinces.length > 0) params.set("provinces", provinces.join(","));
        else params.delete("provinces");

        if (employment && employment !== "ALL") params.set("employment", employment);
        else params.delete("employment");

        if (ownsVehicle) params.set("vehicle", "true");
        else params.delete("vehicle");

        if (ownsHome) params.set("home", "true");
        else params.delete("home");

        if (startDate) params.set("from", startDate);
        else params.delete("from");

        if (endDate) params.set("to", endDate);
        else params.delete("to");

        // Reset page on filter change
        params.delete("page");

        router.push(pathname + "?" + params.toString());
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setLoanType("ALL");
        setProvinces([]);
        setEmployment("ALL");
        setOwnsVehicle(false);
        setOwnsHome(false);
        setStartDate("");
        setEndDate("");
        router.push(pathname);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                        <SelectItem value="ATTEMPTED_TO_CONTACT">Attempted to Contact</SelectItem>
                        <SelectItem value="CONNECTED">Connected</SelectItem>
                        <SelectItem value="QUALIFIED">Qualified</SelectItem>
                        <SelectItem value="UNQUALIFIED">Unqualified</SelectItem>
                        <SelectItem value="DECLINED">Declined</SelectItem>
                        <SelectItem value="FUNDED">Funded</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Loan Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="PERSONAL_LOAN">Personal Loan</SelectItem>
                        <SelectItem value="DEBT_CONSOLIDATION">Debt Consolidation</SelectItem>
                        <SelectItem value="HOME_EQUITY">Home Equity</SelectItem>
                    </SelectContent>
                </Select>

                {/* Province Multi-Select */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[180px] justify-between">
                            {provinces.length > 0 ? `${provinces.length} Selected` : "Province"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search province..." />
                            <CommandEmpty>No province found.</CommandEmpty>
                            <CommandGroup>
                                {PROVINCES.map((province) => (
                                    <CommandItem
                                        key={province.value}
                                        value={province.label}
                                        onSelect={() => {
                                            setProvinces(prev =>
                                                prev.includes(province.value)
                                                    ? prev.filter(p => p !== province.value)
                                                    : [...prev, province.value]
                                            );
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                provinces.includes(province.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {province.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* Employment Status */}
                <Select value={employment} onValueChange={setEmployment}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Employment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Any Employment</SelectItem>
                        {EMPLOYMENT_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status.replace("_", " ")}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* Asset Checkboxes */}
                <div className="flex gap-4 items-center mr-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="vehicle" checked={ownsVehicle} onCheckedChange={(c) => setOwnsVehicle(!!c)} />
                        <Label htmlFor="vehicle">Owns Vehicle</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="home" checked={ownsHome} onCheckedChange={(c) => setOwnsHome(!!c)} />
                        <Label htmlFor="home">Owns Home</Label>
                    </div>
                </div>

                <div className="flex gap-2 items-center flex-1">
                    <div className="grid gap-1.5 flex-1">
                        <label className="text-xs font-medium">From</label>
                        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="grid gap-1.5 flex-1">
                        <label className="text-xs font-medium">To</label>
                        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearFilters}>Reset</Button>
                    <Button onClick={applyFilters}>Apply Filters</Button>
                </div>
            </div>
        </div>
    );
}
