"use strict";


function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function () {
    function t(t, e) {
        for (var s = 0; s < e.length; s++) {
            var i = e[s];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
        }
    }
    return function (e, s, i) {
        return s && t(e.prototype, s), i && t(e, i), e
    }
}();
! function () {
    function t(t) {
        return new i(t)
    }
    var e = {
        BASE: "autocomplete",
        CONTAINER: "autocomplete-container",
        INPUT: "autocomplete__input",
        LABEL: "autocomplete__label",
        RESULTS: {
            BASE: "autocomplete__results",
            VISIBLE: "autocomplete__results--is-visible"
        },
        RESULT: {
            BASE: "autocomplete__result",
            SELECTED: "autocomplete__result--is-selected"
        },
        NOTICE: "autocomplete__notice",
        SELECT_RESULT: "autocomplete__select-result",
        LIST: "autocomplete__list"
    },
        s = {
            ENTER: 13,
            ESC: 27,
            UP: 38,
            DOWN: 40
        },
        i = function () {
            function t(s) {
                var i = this;
                _classCallCheck(this, t), this.select = s, this.select.style.display = "none", this.container = this.select.parentElement, this.container.classList.add(e.CONTAINER), this.container.style.position = "relative";
                var n = [].slice.call(s.querySelectorAll("option")),
                    u = this.select.id + "-autocomplete";
                this.isVisible = !1, this.options = n.map(function (t, e) {
                    return {
                        label: t.textContent,
                        value: t.value,
                        id: i.select.id + "-autocomplete-result-" + e
                    }
                }), this.outputInput(u), this.outputResultsList(u), this.outputResultsNotice(u), window.requestAnimationFrame(function () {
                    i.container.appendChild(i.input), i.container.appendChild(i.resultsList)
                }), this.input.addEventListener("input", function (t) {
                    var e = t.target.value.toLowerCase();
                    i.filterResults(e)


                }), this.input.addEventListener("focus", function () {
                    i.results ? i.showResults() : (i.updateResults(i.options), i.outputResults())
                }), this.input.addEventListener("blur", function () {
                    i.hideResults()
                }), document.body.addEventListener("click", function (t) {
                    i.container.contains(t.target) || i.hideResults()
                }), document.addEventListener("keydown", function (t) {
                    i.keydownEvent(t)
                })
            }
            return _createClass(t, [{
                key: "clearSelected",

                value: function () {
                    var t = this.resultsList.querySelector("." + e.RESULT.SELECTED);
                    t && t.classList.remove(e.RESULT.SELECTED)
                }
            }, {
                key: "selectPreviousOption",
                value: function () {
                    var t = this.resultsList.querySelector("." + e.RESULT.SELECTED);
                    t && (t === this.resultsList.firstChild ? this.selectOption(this.resultsList.lastChild) : this.selectOption(t.previousSibling))
                }
            }, {
                key: "selectNextOption",
                value: function () {
                    var t = this.resultsList.querySelector("." + e.RESULT.SELECTED);
                    t ? t === this.resultsList.lastChild ? this.selectOption(this.resultsList.firstChild) : this.selectOption(t.nextSibling) : this.selectOption(this.resultsList.firstChild)
                }
            }, {
                key: "selectOption",
                value: function (t, s) {
                    var i = this;
                    window.requestAnimationFrame(function () {
                        i.clearSelected(), t.classList.add(e.RESULT.SELECTED), i.input.dataset.selected = t.id, t.scrollIntoView(!1), i.resultsNotice.textContent = t.textContent, s && s()
                    })
                }
            },

            {
                key: "clearResults",
                value: function () {
                    var t = this;

                    window.requestAnimationFrame(function () {
                        for (; t.resultsList.hasChildNodes();) t.resultsList.removeChild(t.resultsList.lastChild)
                    })
                }
            }, {
                key: "filterResults",
                value: function (t) {
                    var e = this.options.filter(function (e) {
                        return e.value.toLowerCase().indexOf(t) != -1 || e.label.toLowerCase().indexOf(t) != -1
                    });
                    this.updateResults(e), this.outputResults()
                }
            }, {
                key: "hideResults",
                value: function () {
                    var t = this;
                    var label = this.container.querySelector("label")
                    console.log("hideResults")
                    label.classList.remove("exemple-label--show")
                    label.classList.add("exemple-label--hide")

                    if (this.input.value === "") {
                        label.classList.remove("exemple-label--hide")
                        label.classList.add("exemple-label--show")
                    }

                    this.isVisible = !1, window.requestAnimationFrame(function () {
                        t.resultsList.classList.remove(e.RESULTS.VISIBLE), t.input.setAttribute("aria-expanded", "false")
                    })
                }
            }, {
                key: "updateResults",
                value: function (t) {
                    this.clearResults(), this.results = t
                }
            }, {
                key: "outputResults",
                value: function () {
                    var t = this;
                    this.results.length > 0 ? this.results.forEach(function (s) {
                        var i = document.createElement("li");
                        i.setAttribute("id", s.id), i.classList.add(e.RESULT.BASE), i.textContent = s.label, i.dataset.value = s.value, i.setAttribute("role", "option"), i.addEventListener("click", function (e) {
                            t.selectOption(e.target, function () {
                                return t.chooseOption()
                            })
                        }), window.requestAnimationFrame(function () {
                            t.resultsList.appendChild(i)
                        })
                    }) : ! function () {
                        var s = document.createElement("li");
                        s.classList.add(e.RESULT.BASE), s.textContent = "No results found", window.requestAnimationFrame(function () {
                            t.resultsList.appendChild(s)
                        })
                    }(), this.showResults()
                }
            }, {
                key: "showResults",
                value: function () {


                    var t = this;
                    // console.log("showResults")
                    this.label = this.container.querySelector("label")
                    t.label.classList.remove("exemple-label--show")
                    t.label.classList.add("exemple-label--hide")

                    this.isVisible = !0, window.requestAnimationFrame(function () {
                        t.resultsList.classList.add(e.RESULTS.VISIBLE), t.input.setAttribute("aria-expanded", "true"), 0 === t.results.length ? t.resultsNotice.textContent = "No results found" : 1 === t.results.length ? t.resultsNotice.textContent = "1 result" : t.resultsNotice.textContent = t.results.length + " results"
                    })
                }
            },

            {
                key: "chooseOption",
                value: function () {
                    var t = document.getElementById(this.input.dataset.selected);
                    this.input.value = t.textContent, this.select.value = t.dataset.value, this.resultsNotice.textContent = t.textContent + " selected", this.hideResults()
                }
            },

            {
                key: "outputInput",
                value: function (t) {
                    var s = this;
                    this.input = document.createElement("input"), this.input.type = "text", this.input.setAttribute("role", "combobox"), this.input.setAttribute("aria-expanded", "false"), this.input.setAttribute("aria-autocomplete", "list"), this.input.setAttribute("aria-owns", t), this.input.classList.add(e.INPUT), window.requestAnimationFrame(function () {
                        s.container.appendChild(s.input)
                    })

                }
            }, {
                key: "outputResultsList",
                value: function (t) {
                    var s = this;

                    this.resultsList = document.createElement("ul"), this.resultsList.classList.add(e.RESULTS.BASE), this.resultsList.setAttribute("id", t), this.resultsList.setAttribute("role", "listbox"), window.requestAnimationFrame(function () {
                        s.container.appendChild(s.resultsList)
                    })
                }
            }, {
                key: "outputResultsNotice",
                value: function () {
                    var t = this;
                    this.resultsNotice = document.createElement("div"), this.resultsNotice.classList.add(e.NOTICE), this.resultsNotice.setAttribute("role", "status"), this.resultsNotice.setAttribute("aria-live", "polite"), window.requestAnimationFrame(function () {

                        t.container.appendChild(t.resultsNotice)
                    })
                }
            }, {
                key: "keydownEvent",
                value: function (t) {
                    if (this.container.contains(t.target)) switch (t.keyCode) {
                        case s.ENTER:
                            this.chooseOption();
                            break;
                        case s.ESC:
                            this.hideResults(), this.input.blur();
                            break;
                        case s.DOWN:
                            this.isVisible ? this.selectNextOption() : this.showResults(), t.preventDefault();
                            break;
                        case s.UP:
                            t.preventDefault(), this.selectPreviousOption()
                    }
                }
            }]), t
        }();
    document.addEventListener("DOMContentLoaded", function () {
        var s = [].slice.call(document.querySelectorAll("." + e.BASE));
        s.forEach(t)
    })
}();



