import { BotIcon, WorkflowIcon, PlugIcon, ShieldCheckIcon, BarChartIcon, CpuIcon } from "lucide-react";
import type { IFeature } from "../types";

export const features: IFeature[] = [
    {
        title: "AI Agent Builder",
        description:
            "Design intelligent agents with modular logic, memory and tools - no complex setup required.",
        icon: BotIcon
    },
    {
        title: "Workflow Orchestration",
        description:
            "Chain actions, triggers and decisions to automate multi-step workflows reliably.",
        icon: WorkflowIcon
    },
    {
        title: "Plug & Play Integrations",
        description:
            "Connect APIs, databases and third-party tools seamlessly with built-in connectors.",
        icon: PlugIcon
    },
    {
        title: "Production-Ready Security",
        description:
            "Built-in safeguards, rate limits and isolation to run agents safely at scale and protect your data.",
        icon: ShieldCheckIcon,
    },
    {
        title: "Real-Time Monitoring",
        description:
            "Track executions, logs and performance metrics in real time and get insights into your agent's behavior.",
        icon: BarChartIcon,
    },
    {
        title: "Scalable Infrastructure",
        description:
            "Run agents efficiently across workloads with automatic scaling and optimization.",
        icon: CpuIcon,
    },
]