"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/products";
import { WatchDial } from "@/components/three/WatchDial";
import { watches } from "@/lib/products";
import { CheckIcon, ArrowRight } from "@/components/ui/icons";

type Pay = "card" | "cod";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const [pay, setPay] = useState<Pay>("card");
  const [done, setDone] = useState(false);
  const [orderId] = useState(() => "MRD-" + Math.floor(100000 + Math.random() * 899999));

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) return <Confirmation orderId={orderId} pay={pay} />;

  if (items.length === 0)
    return (
      <div className="grid min-h-[80vh] place-items-center pt-28">
        <div className="text-center">
          <p className="font-display text-4xl">Your selection is empty</p>
          <p className="mt-3 text-muted">Add a timepiece before checking out.</p>
          <Link href="/collection" className="btn btn-gold mt-8">
            Explore Collection
          </Link>
        </div>
      </div>
    );

  return (
    <div className="pt-28">
      <div className="section-pad">
        <p className="eyebrow mb-4">Secure Demo Checkout</p>
        <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] font-light leading-tight">Complete your acquisition</h1>
      </div>

      <form onSubmit={place} className="section-pad mt-10 grid grid-cols-1 gap-12 pb-28 lg:grid-cols-[1.4fr_1fr]">
        {/* left: forms */}
        <div className="flex flex-col gap-12">
          <Fieldset step="01" title="Customer Information">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="First name" name="first" autoComplete="given-name" />
              <Input label="Last name" name="last" autoComplete="family-name" />
              <Input label="Email" name="email" type="email" autoComplete="email" />
              <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
            </div>
          </Fieldset>

          <Fieldset step="02" title="Shipping Information">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Address" name="address" className="sm:col-span-2" autoComplete="street-address" />
              <Input label="City" name="city" autoComplete="address-level2" />
              <Input label="State / Region" name="state" autoComplete="address-level1" />
              <Input label="Postal code" name="zip" autoComplete="postal-code" />
              <Input label="Country" name="country" autoComplete="country-name" />
            </div>
          </Fieldset>

          <Fieldset step="03" title="Payment Method">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PayOption active={pay === "card"} onClick={() => setPay("card")} title="Credit / Debit Card" sub="Visa · Mastercard · Amex" />
              <PayOption active={pay === "cod"} onClick={() => setPay("cod")} title="Cash on Delivery" sub="Pay upon white-glove delivery" />
            </div>

            {pay === "card" && (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input label="Cardholder name" name="ccname" className="sm:col-span-2" />
                <Input label="Card number" name="ccnum" placeholder="0000 0000 0000 0000" inputMode="numeric" className="sm:col-span-2" />
                <Input label="Expiry" name="ccexp" placeholder="MM / YY" inputMode="numeric" />
                <Input label="CVC" name="cvc" placeholder="123" inputMode="numeric" />
              </div>
            )}
            <p className="mt-5 rounded-xl border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-faint">
              This is a portfolio demonstration. No payment is processed and no card details are stored, transmitted,
              or validated. Please do not enter real card numbers.
            </p>
          </Fieldset>
        </div>

        {/* right: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-bg-2 p-7">
            <p className="eyebrow mb-6">Order Summary</p>
            <ul className="flex flex-col gap-4">
              {items.map((it) => {
                const w = watches.find((x) => x.slug === it.slug);
                const mat = w?.variants.find((v) => v.id === it.variantId)?.three ?? w?.variants[0].three;
                return (
                  <li key={it.key} className="flex items-center gap-4">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-line bg-bg">
                      {mat && <WatchDial mat={mat} dialType={w?.dialType} className="h-full w-full" seconds={false} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-tight">{it.name}</p>
                      <p className="text-xs text-muted">{it.variantName}</p>
                      <p className="text-xs text-faint">Qty {it.qty}</p>
                    </div>
                    <span className="text-sm text-accent">{formatPrice(it.price * it.qty)}</span>
                  </li>
                );
              })}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <Row k="Subtotal" v={formatPrice(subtotal)} />
              <Row k="White-glove delivery" v={formatPrice(shipping)} />
              <div className="flex justify-between border-t border-line pt-3 text-base font-medium text-text">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <button type="submit" className="btn btn-gold mt-6 w-full">
              {pay === "cod" ? "Place Order" : "Pay"} {formatPrice(total)} <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-[0.7rem] text-faint">Demo only · no charge will be made</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Confirmation({ orderId, pay }: { orderId: string; pay: Pay }) {
  return (
    <div className="grid min-h-[90vh] place-items-center pt-28">
      <div className="section-pad max-w-lg text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-accent text-accent">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h1 className="mt-8 font-display text-[clamp(2.4rem,6vw,4rem)] font-light leading-tight">
          Thank you for your <span className="gold-text italic">order.</span>
        </h1>
        <p className="mt-4 text-muted">
          Your acquisition is confirmed. Order <span className="text-text">{orderId}</span> —{" "}
          {pay === "cod" ? "payable on delivery" : "payment received"}. A client advisor will contact you to arrange
          white-glove delivery.
        </p>
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-faint">
          This is a portfolio demonstration. No real order was placed and no payment was processed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/collection" className="btn btn-gold">
            Continue Exploring
          </Link>
          <Link href="/" className="btn btn-ghost">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Fieldset({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <span className="font-display text-2xl text-accent">{step}</span>
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Input({
  label,
  name,
  type = "text",
  className = "",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={name} className="eyebrow text-[0.58rem]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="border-b border-line-strong bg-transparent py-2.5 text-text outline-none transition-colors focus:border-accent"
        {...rest}
      />
    </div>
  );
}

function PayOption({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-400 ${
        active ? "border-accent bg-accent/10" : "border-line hover:border-line-strong"
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full border ${active ? "border-accent" : "border-line-strong"}`}
      >
        {active && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
      </span>
      <span>
        <span className="block text-sm font-medium text-text">{title}</span>
        <span className="block text-xs text-muted">{sub}</span>
      </span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-muted">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
