export function get_sorted_set_map(sorted_set_arr: number[][]) {
    let dIdeals: Sorted_set[] = []
    let sorted_set: Sorted_set = new Sorted_set(sorted_set_arr)
    get_dual_ideals(sorted_set, dIdeals)
    let res: number[] = []
    sorted_set._elements.forEach((element) => {
        let sum = 0
        dIdeals.forEach((el) => {
            if (el._elements.includes(element)) sum += el._weight
        })
        res.push(sum)
    })
    return res
}

function get_dual_ideals(sorted_set: Sorted_set, arr: Sorted_set[]) {
    let min_elems = sorted_set.get_min_elements()
    if (min_elems.length === 0 || is_in(sorted_set, arr)) return
    arr.push(sorted_set)
    min_elems.forEach((elem) => {
        get_dual_ideals(sorted_set.get_subset_without_elem(elem), arr)
    })
}

function is_in(sorted_set: Sorted_set, arr: Sorted_set[]) {
    let res = false
    let elements = sorted_set._elements
    arr.forEach((elem) => {
        if (!res) {
            let isEqual = true
            for (let i = 0; i < elements.length; i++)
                if (elem._elements[i] !== elements[i]) {
                    isEqual = false
                    break
                }
            res = isEqual
        }
    })
    return res
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

class Sorted_set {
    _elements: number[]
    _sorted_set_arr: number[][]
    _weight: number

    constructor(sorted_set_arr: number[][]) {
        this._sorted_set_arr = []
        sorted_set_arr.forEach(el => this._sorted_set_arr.push([...el]));
        this._elements = Array.from(sorted_set_arr.keys());
        this._weight = randomIntFromInterval(1, 2);
    }

    get_subset_without_elem(index: number): Sorted_set {
        let res = new Sorted_set(this._sorted_set_arr)
        res._elements = [...this._elements]
        res._elements[index] = -1
        res._sorted_set_arr.forEach((elem) => elem[index] = -1)
        for (let i = 0; i < res._sorted_set_arr[index].length; i++) res._sorted_set_arr[index][i] = -1
        return res
    }

    get_min_elements(): number[] {
        let res: number[] = []
        this._elements.forEach((index) => {
            if (index !== -1) {
                let sum = 0
                this._sorted_set_arr.forEach((elem) => sum += (elem[index] !== -1 ? elem[index] : 0))
                if (sum === 0) res.push(index)
            }
        })
        return res
    }
}
