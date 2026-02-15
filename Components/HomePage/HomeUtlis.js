export const filterOrder = (data) => {
    if (data === 'today') {
        return 'Today'
    } else if (data === 'yesterday') {
        return 'Yesterday'
    } else if (data === 'weekly') {
        return 'Weekly'
    } else if (data === 'monthly') {
        return 'Monthly'
    } else if (data === 'all') {
        return 'Life Time'
    }
    else if (data === 'custom') {
        return 'Custom'
    }


}



export const filterChannelData = (data) => {
    if (data === 'today') {
        return 'Today'
    } else if (data === 'yesterday') {
        return 'Yesterday'
    } else if (data === 'weekly') {
        return 'Last 7 Days'
    } else if (data === 'monthly') {
        return 'This Month'
    }
    else if (data === 'custom') {
        return 'Custom'
    }


}

export const filterOverview = (data) => {
    if (data === 'week') {
        return ' Last Weekly'
    } else if (data === 'today') {
        return 'Today'
    }
    else if (data === 'yesterday') {
        return 'Yesterday'
    }
    else if (data === 'month') {
        return 'Last 30th days'
    } else if (data === 'year') {
        return 'Yearly'
    }

}

export const colorCheck = (num) => {
    if (num < 20 && num > 0) {
        return ""
    } else if (num < 71 && num > 21) {
        return "b"
    } else if (num => 80) {
        return ""
    }
}