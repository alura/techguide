// Function to group list items with checkboxes
export function groupCheckboxListItems(html: string): string {
  // Use regex to find <ul> blocks and process them
  return html.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, ulContent) => {
    // Split the content by <li> tags
    const listItems = ulContent.split(/(?=<li>)/);
    let result = "<ul>";

    for (let i = 0; i < listItems.length; i++) {
      const item = listItems[i];
      if (item.trim() === "") continue;

      // Check if this <li> contains a checkbox
      if (item.includes("<input") && item.includes('type="checkbox"')) {
        // Find all subsequent non-checkbox items until the next checkbox
        const nestedItems: string[] = [];
        let j = i + 1;
        while (j < listItems.length) {
          const nextItem = listItems[j];
          if (nextItem.trim() === "") {
            j++;
            continue;
          }
          // If we hit another checkbox, stop
          if (
            nextItem.includes("<input") &&
            nextItem.includes('type="checkbox"')
          ) {
            break;
          }
          nestedItems.push(nextItem);
          j++;
        }

        // Create the checkbox item with nested list
        if (nestedItems.length > 0) {
          // Remove the closing </li> from the checkbox item
          const checkboxItem = item.replace(/<\/li>$/, "");
          result += checkboxItem;
          result += "<ul>";
          result += nestedItems.join("");
          result += "</ul></li>";
          // Skip the items we've already processed
          i = j - 1;
        } else {
          result += item;
        }
      } else {
        // This is a regular list item, add it directly
        result += item;
      }
    }

    result += "</ul>";
    return result;
  });
}

// Function to wrap input tags with span for custom styling
export function wrapInputTagsWithSpan(html: string): string {
  return html.replace(
    /(<input[^>]*type="checkbox"[^>]*>)/g,
    '<span class="checkbox-wrapper">$1</span>'
  );
}

// Main function to process HTML with all transformations
export function processHtml(html: string): string {
  let processedHtml = html;

  // First wrap input tags with spans
  processedHtml = wrapInputTagsWithSpan(processedHtml);

  // Then group checkbox list items
  processedHtml = groupCheckboxListItems(processedHtml);

  return processedHtml;
}
