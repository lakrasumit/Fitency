// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SegmentedControl } from "@/components/segmented-control"

const OPTIONS = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
] as const

afterEach(cleanup)

describe("SegmentedControl", () => {
  it("exposes the group label and pressed state", () => {
    render(
      <SegmentedControl
        label="Range"
        options={OPTIONS}
        value="month"
        onChange={() => {}}
      />,
    )

    expect(screen.getByRole("group", { name: "Range" })).toBeTruthy()
    expect(
      screen.getByRole("button", { name: "Week" }).getAttribute("aria-pressed"),
    ).toBe("false")
    expect(
      screen
        .getByRole("button", { name: "Month" })
        .getAttribute("aria-pressed"),
    ).toBe("true")
  })

  it("reports the value of the clicked option", () => {
    const onChange = vi.fn()

    render(
      <SegmentedControl
        label="Range"
        options={OPTIONS}
        value="month"
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Week" }))
    expect(onChange).toHaveBeenCalledWith("week")
  })
})
