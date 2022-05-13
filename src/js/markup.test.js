import markup from "./markup";

describe("markup", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  body.appendChild(app).setAttribute("id", "app");
  markup(app);
  it("the page has an input element", () => {
    const element = document
      .querySelector("body")
      .querySelectorAll('[id="input"]');
    expect(element.length).toBe(1);
  });
  it("the page has an button element", () => {
    const element = document
      .querySelector("body")
      .querySelectorAll('[id="button"]');
    expect(element.length).toBe(1);
  });
  it("the page has an map element", () => {
    const element = document
      .querySelector("body")
      .querySelectorAll('[id="map"]');
    expect(element.length).toBe(1);
  });
  it("the page has an memory element", () => {
    const element = document
      .querySelector("body")
      .querySelectorAll('[id="memory"]');
    expect(element.length).toBe(1);
  });
  it("the page has an weather element", () => {
    const element = document
      .querySelector("body")
      .querySelectorAll('[id="weather"]');
    expect(element.length).toBe(1);
  });
});
