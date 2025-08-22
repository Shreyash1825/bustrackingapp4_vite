import * as React from "react"
import {
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts"

import { cn } from "@/lib/utils"

// ============================
// Chart Tooltip
// ============================

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config } = useChart ? useChart() : { config: {} }

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = labelKey || item?.dataKey || item?.name || "value"
    const itemConfig = getPayloadConfigFromPayload(config, item, key)

    let value = !labelKey && typeof label === "string" ? config[label] : label
    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) return null
    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel && tooltipLabel}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = nameKey || item.name || item.dataKey || "value"
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload?.fill || item.color

          return (
            <div
              key={item.dataKey || index}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2",
                indicator === "dot" && "items-center"
              )}
            >
              {/* Indicator */}
              {!hideIndicator && (
                <div
                  className={cn("shrink-0 rounded-sm", {
                    "h-2.5 w-2.5": indicator === "dot",
                    "w-1 h-3": indicator === "line",
                    "w-0 border-[1.5px] border-dashed bg-transparent h-3":
                      indicator === "dashed",
                  })}
                  style={{
                    backgroundColor: indicatorColor,
                    borderColor: indicatorColor,
                  }}
                />
              )}

              {/* Label + Value */}
              <div
                className={cn(
                  "flex flex-1 justify-between leading-none",
                  nestLabel ? "items-end" : "items-center"
                )}
              >
                <div className="grid gap-1.5">
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                </div>
                {item.value != null && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {item.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================
// Chart Legend
// ============================

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}) {
  const { config } = useChart ? useChart() : { config: {} }

  if (!payload?.length) return null

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, index) => {
        const key = nameKey || item.dataKey || "value"
        const itemConfig = getPayloadConfigFromPayload(config, item, key)
        return (
          <div
            key={item.value || index}
            className="flex items-center gap-1.5"
          >
            {!hideIcon && (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color || item.payload?.fill,
                }}
              />
            )}
            <span>{itemConfig?.label || item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

// ============================
// Helpers
// ============================

function getPayloadConfigFromPayload(config, payload, key) {
  if (!payload || typeof payload !== "object") return undefined

  const payloadPayload =
    payload.payload && typeof payload.payload === "object"
      ? payload.payload
      : null

  let configLabelKey
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key]
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey && config[configLabelKey] ? config[configLabelKey] : undefined
}

// ============================
// Exports
// ============================

const ChartTooltip = RechartsTooltip
const ChartLegend = RechartsLegend

export {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
