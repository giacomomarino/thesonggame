import { Show, createSignal, For, batch } from "solid-js";
import { AiOutlineDown } from 'solid-icons/ai'

function Select({ options, selectedValue, setSelectedValue }) {
    const [showMenu, setShowMenu] = createSignal(false)
    const [name, setName] = createSignal(options[0].name)
    setSelectedValue(options[0].value)

    return (
        <div className="flex-col justify-center mx-auto text-center">
            <div className="border border-black dark:border-white min-w-12 p-2 mb-0 mx-auto rounded-md flex justify-center"
                onClick={(evt) => {
                    evt.preventDefault()
                    setShowMenu(!showMenu())
                }}>{name()}<div className="ml-2 "><AiOutlineDown className="mt-1" /></div>
            </div>
            <div className="p-2 pt-0 z-50 inline-flex justify-center text-center absolute left-1/2 top-1/12" style={{transform: "translate(-50%, 0%"}}>
                <Show when={showMenu()}>
                    <ul className="bg-white dark:bg-gray-700 w-full">
                        <For each={options}>
                            {(opt) => (
                                <li className="song border border-black dark:border-white p-2 m-0 col-auto text-centefont-light w-full"
                                    classList={{ selected: selectedValue() === opt.value }}
                                    onClick={(evt) => {
                                        evt.preventDefault()
                                        batch(() => {
                                            setShowMenu(false)
                                            setSelectedValue(opt.value)
                                            setName(opt.name)
                                        })
                                    }}>
                                    <p className="text-sm font-sans">{opt.name}</p>
                                </li>
                            )}
                        </For>
                    </ul>
                </Show>
            </div>
        </div>
    )
}

export default Select;