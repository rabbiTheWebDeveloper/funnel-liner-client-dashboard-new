export function cls(...inputs) {
  const classes = inputs
    .flat()
    .filter(Boolean)
    .map(item => {
      if (typeof item === "string") return item;
      if (typeof item === "object") {
        return Object.entries(item)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .join(" ");

  return [...new Set(classes.split(" "))].filter(Boolean).join(" ");
}

/**
 * Extracts all CSS custom properties from an element and applies them to :root
 * @param {string | HTMLElement} target - CSS selector or HTML Element
 * @returns {void}
 */
export function propagateVariablesToRoot(target) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!element) {
    console.warn("Element not found for propagating variables");
    return;
  }

  const styles = getComputedStyle(element);
  const root = document.documentElement;

  // Get the CSS rules that apply to this element
  const sheets = document.styleSheets;
  const variables = new Set();

  try {
    // Collect all CSS variable names from stylesheets
    for (const sheet of sheets) {
      for (const rule of sheet.cssRules) {
        const cssText = rule.cssText;
        const matches = cssText.match(/--[\w-]+/g);
        if (matches) {
          matches.forEach(match => variables.add(match));
        }
      }
    }

    // Propagate found variables to root
    variables.forEach(variable => {
      const value = styles.getPropertyValue(variable);
      if (value) {
        root.style.setProperty(variable, value.trim());
      }
    });
  } catch (e) {
    console.warn("Error accessing styleSheets:", e);
  }
}
