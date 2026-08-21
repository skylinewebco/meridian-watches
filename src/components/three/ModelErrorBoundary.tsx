"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches a failed GLTF load (missing file, bad model) inside the R3F tree and
 * renders a fallback (the procedural watch) instead of crashing the Canvas.
 */
export class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // swallow — the fallback is the intended UX until a real model is provided
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
