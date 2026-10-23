import { describe, expect, it } from "vitest"
import { initials } from "@/lib/utils/format"

describe("initials", () => {
  it("uses the first letter of the first two words", () => {
    expect(initials("Sarfarosh Alam")).toBe("SA")
  })

  it("ignores extra whitespace and extra words", () => {
    expect(initials("  ada   lovelace king ")).toBe("AL")
  })

  it("handles a single name", () => {
    expect(initials("Prince")).toBe("P")
  })

  it("falls back for a blank name", () => {
    expect(initials("   ")).toBe("?")
  })
})
