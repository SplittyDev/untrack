#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { Matchers } from './src/matchers.mjs'

let params = {}
let replacements = {}

const processMatcher = (key, matcher) => {
    if ('params' in matcher) {
        if (key in params) {
            params[key] = params[key].concat(matcher.params)
        } else {
            params[key] = matcher.params
        }
    }
    if ('replace' in matcher) {
        if (key in replacements) {
            replacements[key] = replacements[key].concat([matcher.replace])
        } else {
            replacements[key] = [matcher.replace]
        }
    }
}

for (const [key, matcher] of Object.entries(Matchers)) {
    if (Array.isArray(matcher)) {
        for (const m of matcher) {
            processMatcher(key, m)
        }
    } else {
        processMatcher(key, matcher)
    }
}

const paramsText = Object.entries(params).map(([key, params]) => (
    `- ${key}: ${params.map(p => `\`${p}\``).join(', ')}`
)).join('\n')

const replacementsText = Object.entries(replacements).map(([key, regex]) => (
    `- ${key}`
)).join('\n')

let template = readFileSync('README.template').toString('utf-8')
template = template.replace('%tracking_params%', paramsText)
template = template.replace('%declutter%', replacementsText)

writeFileSync('README.md', template)