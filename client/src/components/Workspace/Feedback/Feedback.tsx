import React from "react";

type FeedbackProps = {};

const Feedback: React.FC<FeedbackProps> = () => {
    return (
        <div className="bg-dark-layer-1">
            {/* TAB */}
            <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
                <div
                    className={
                        "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
                    }
                >
                    Feedback
                </div>
            </div>

            <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
                <div className="px-5">
                    <div className="w-full text-white">
                        <p>
                            {" "}
                            Certainly! Here are the errors in the provided
                            JavaScript code:
                        </p>
                        <br />
                        <ol>
                            <li>
                                <b>1. Inefficient Solution:</b> The code uses
                                <code>nums.includes(complement)</code> inside
                                the loop, which has a time complexity of O(n)
                                for each iteration. This results in a total time
                                complexity of O(n^2), making the solution
                                inefficient.
                            </li>
                            <br />
                            <li>
                                <b>2. Incorrect Return Statement: </b>The code
                                returns{" "}
                                <code>[i, nums.indexOf(complement)]</code>,
                                which is incorrect. The problem states that you
                                should return indices, but{" "}
                                <code>nums.indexOf(complement)</code>
                                gives the index of the first occurrence of the
                                complement, not the correct index for the second
                                number.
                            </li>
                            <br />
                            <li>
                                <b>3. May Use Same Element Twice:</b> The code
                                does not handle the case where the same element
                                can be used twice. For example, if{" "}
                                <code>nums = [3, 3]</code>
                                and <code>target = 6</code>, the current
                                implementation would return <code>[0, 0]</code>,
                                violating the requirement of not using the same
                                element twice.
                            </li>
                            <br />
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Feedback;
