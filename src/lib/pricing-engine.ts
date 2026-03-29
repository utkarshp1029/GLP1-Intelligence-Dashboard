import type { Brand, PenSpec, CostCalculation } from '../types/pricing';

export function calculateCostPerMg(
  pen: PenSpec,
  priceType: 'list' | 'discounted' = 'list',
  currency: 'USD' | 'INR' = 'INR'
): number | null {
  const pricePoint = pen.price.find((p) => p.currency === currency);
  if (!pricePoint) return null;

  const price =
    priceType === 'discounted' && pricePoint.discounted_price
      ? pricePoint.discounted_price
      : pricePoint.list_price;

  if (pen.total_mg <= 0) return null;
  return price / pen.total_mg;
}

export function dosesAvailableFromPen(pen: PenSpec, dose_mg: number): number {
  if (dose_mg <= 0 || pen.total_mg <= 0) return 0;
  return Math.floor(pen.total_mg / dose_mg);
}

export function calculateDoseCost(
  pen: PenSpec,
  dose_mg: number,
  brand: Brand,
  priceType: 'list' | 'discounted' = 'list',
  currency: 'USD' | 'INR' = 'INR'
): CostCalculation | null {
  const pricePoint = pen.price.find((p) => p.currency === currency);
  if (!pricePoint) return null;

  const price =
    priceType === 'discounted' && pricePoint.discounted_price
      ? pricePoint.discounted_price
      : pricePoint.list_price;

  const doses = dosesAvailableFromPen(pen, dose_mg);
  if (doses <= 0) return null;

  const costPerDose = price / doses;
  const costPerMg = price / pen.total_mg;
  const costPerWeek = costPerDose; // Assuming weekly dosing
  const costPerMonth = costPerWeek * 4.33;
  const costPerYear = costPerWeek * 52;
  const pensPerMonth = 4.33 / doses;

  const labeledDose = pen.intended_doses.find((d) => d.dose_mg === dose_mg);
  const isMicrodose = labeledDose ? labeledDose.is_microdose : !labeledDose;

  return {
    brand_id: brand.id,
    brand_name: brand.name,
    manufacturer: brand.manufacturer,
    pen_id: pen.id,
    pen_label: pen.pen_label,
    format: pen.format,
    dose_mg,
    is_microdose: isMicrodose,
    microdosable: pen.microdosable,
    cost_per_mg: costPerMg,
    cost_per_dose: costPerDose,
    cost_per_week: costPerWeek,
    cost_per_month: costPerMonth,
    cost_per_year: costPerYear,
    doses_per_pen: doses,
    pens_per_month: pensPerMonth,
    currency,
    total_mg_in_pen: pen.total_mg,
    list_price: price,
  };
}

export function compareBrands(
  brands: Brand[],
  dose_mg: number,
  currency: 'USD' | 'INR' = 'INR',
  priceType: 'list' | 'discounted' = 'list'
): CostCalculation[] {
  const results: CostCalculation[] = [];

  for (const brand of brands) {
    for (const sub of brand.sub_brands) {
      for (const pen of sub.pens) {
        // Skip pens that can't deliver this dose
        if (dose_mg > pen.total_mg) continue;
        // Skip non-microdosable pens for off-label doses
        const hasLabeledDose = pen.intended_doses.some(
          (d) => d.dose_mg === dose_mg
        );
        if (!hasLabeledDose && !pen.microdosable) continue;

        const calc = calculateDoseCost(pen, dose_mg, brand, priceType, currency);
        if (calc) results.push(calc);
      }
    }
  }

  return results.sort((a, b) => a.cost_per_dose - b.cost_per_dose);
}

export function formatCurrency(amount: number, currency: 'USD' | 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}
